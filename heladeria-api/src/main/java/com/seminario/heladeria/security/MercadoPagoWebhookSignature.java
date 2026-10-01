package com.seminario.heladeria.security;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

public final class MercadoPagoWebhookSignature {

    private MercadoPagoWebhookSignature() {}

    public static boolean isValid(String signature, String requestId, String dataId, String secret) {
        if (secret == null || secret.isBlank() || signature == null
                || requestId == null || dataId == null) return false;
        try {
            String timestamp = null;
            String received = null;
            for (String part : signature.split(",")) {
                String[] pair = part.trim().split("=", 2);
                if (pair.length == 2 && "ts".equals(pair[0])) timestamp = pair[1];
                if (pair.length == 2 && "v1".equals(pair[0])) received = pair[1];
            }
            if (timestamp == null || received == null) return false;
            String manifest = "id:" + dataId + ";request-id:" + requestId + ";ts:" + timestamp + ";";
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            String expected = java.util.HexFormat.of().formatHex(
                    mac.doFinal(manifest.getBytes(StandardCharsets.UTF_8)));
            return MessageDigest.isEqual(expected.getBytes(StandardCharsets.US_ASCII),
                    received.getBytes(StandardCharsets.US_ASCII));
        } catch (Exception e) {
            return false;
        }
    }
}
