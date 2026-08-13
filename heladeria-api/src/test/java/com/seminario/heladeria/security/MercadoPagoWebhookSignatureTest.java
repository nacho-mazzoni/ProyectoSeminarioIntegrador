package com.seminario.heladeria.security;

import org.junit.jupiter.api.Test;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;

class MercadoPagoWebhookSignatureTest {

    @Test
    void acceptsMercadoPagoManifestAndRejectsTampering() throws Exception {
        String manifest = "id:123;request-id:req-1;ts:1700000000;";
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec("secret".getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        String hash = java.util.HexFormat.of().formatHex(mac.doFinal(manifest.getBytes(StandardCharsets.UTF_8)));

        assertTrue(MercadoPagoWebhookSignature.isValid("ts=1700000000,v1=" + hash,
                "req-1", "123", "secret"));
        assertFalse(MercadoPagoWebhookSignature.isValid("ts=1700000000,v1=" + hash,
                "req-2", "123", "secret"));
    }
}
