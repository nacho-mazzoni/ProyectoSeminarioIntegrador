package com.seminario.heladeria.controller;

import com.seminario.heladeria.service.PagoService;
import com.seminario.heladeria.security.MercadoPagoWebhookSignature;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mercadopago.resources.payment.Payment;

@Slf4j
@RestController
@RequestMapping("/api/pagos")
public class PagoWebhookController {

    private final PagoService pagoService;
    private final ObjectMapper objectMapper;
    private final String webhookSecret;
    private final boolean mercadoPagoConfigured;

    public PagoWebhookController(PagoService pagoService,
                                  ObjectMapper objectMapper,
                                  @Value("${mercadopago.webhook-secret:}") String webhookSecret,
                                  @Value("${mercadopago.access-token:}") String accessToken) {
        this.pagoService = pagoService;
        this.objectMapper = objectMapper;
        this.webhookSecret = webhookSecret;
        this.mercadoPagoConfigured = accessToken != null && !accessToken.isBlank();
    }

    @PostMapping("/notificacion")
    public ResponseEntity<String> recibirNotificacion(@RequestBody String rawBody,
                                                       @RequestHeader(value = "x-signature", required = false) String signature,
                                                       @RequestHeader(value = "x-request-id", required = false) String requestId,
                                                       @RequestParam(value = "data.id", required = false) String queryDataId,
                                                       @RequestParam(value = "id", required = false) String queryId,
                                                       @RequestParam(value = "type", required = false) String queryType,
                                                       @RequestParam(value = "topic", required = false) String queryTopic) {
        JsonNode body;
        try {
            body = objectMapper.readTree(rawBody);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid JSON");
        }
        if (!body.isObject()) return ResponseEntity.badRequest().body("Invalid payload");
        String dataId = body.path("data").path("id").asText(null);
        if (dataId == null) dataId = queryDataId != null ? queryDataId : queryId;
        if (mercadoPagoConfigured && (webhookSecret == null || webhookSecret.isBlank()
                || !MercadoPagoWebhookSignature.isValid(signature, requestId, dataId, webhookSecret))) {
            return ResponseEntity.status(401).body("Invalid signature");
        }
        if (dataId == null || dataId.isBlank()) return ResponseEntity.badRequest().body("Missing payment id");
        String action = body.path("action").asText(null);
        if (action != null && !action.contains(".updated")) return ResponseEntity.badRequest().body("Invalid action");
        String topic = body.path("type").asText(null);
        if (topic == null || topic.isBlank()) topic = body.path("topic").asText(null);
        if (topic == null) topic = queryType != null ? queryType : queryTopic;

        if (!"payment".equals(topic)) return ResponseEntity.badRequest().body("Invalid notification type");
        try {
            Payment payment = pagoService.consultarPagoMP(Long.parseLong(dataId));
            String externalRef = payment.getExternalReference();
            String status = payment.getStatus();
            if (externalRef == null || externalRef.isBlank() || status == null || status.isBlank()) {
                return ResponseEntity.badRequest().body("Incomplete payment payload");
            }
            pagoService.procesarWebhook(externalRef, status);
            return ResponseEntity.ok("OK");
        } catch (IllegalArgumentException e) {
            log.error("Payload inválido de Mercado Pago", e);
            return ResponseEntity.badRequest().body("Invalid payment payload");
        } catch (Exception e) {
            log.error("Error procesando notificación de Mercado Pago", e);
            return ResponseEntity.status(500).body("Processing error");
        }
    }

}
