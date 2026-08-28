package com.devforge.util;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

/**
 * AES-256 encrypt/decrypt utility for storing monitored API keys at rest.
 */
@Slf4j
@Component
public class EncryptionUtils {

    @Value("${apisentinel.encryption.secret-key}")
    private String secretKeyString;

    private static final String ALGORITHM = "AES";

    @PostConstruct
    private void validateSecretKey() {
        if (secretKeyString == null || secretKeyString.isBlank()) {
            throw new IllegalStateException("Missing required property: apisentinel.encryption.secret-key");
        }
        if (secretKeyString.getBytes().length < 16) {
            throw new IllegalStateException("apisentinel.encryption.secret-key must be at least 16 bytes");
        }
    }

    private SecretKeySpec getSecretKey() {
        byte[] key = secretKeyString.getBytes();
        byte[] validKey = new byte[32]; // AES-256
        System.arraycopy(key, 0, validKey, 0, Math.min(key.length, 32));
        return new SecretKeySpec(validKey, ALGORITHM);
    }

    public String encrypt(String value) {
        if (value == null || value.trim().isEmpty()) return value;
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, getSecretKey());
            byte[] encryptedValue = cipher.doFinal(value.getBytes());
            return Base64.getEncoder().encodeToString(encryptedValue);
        } catch (Exception e) {
            throw new RuntimeException("Error encrypting API key", e);
        }
    }

    public String decrypt(String value) {
        if (value == null || value.trim().isEmpty()) return value;
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, getSecretKey());
            byte[] decryptedValue = cipher.doFinal(Base64.getDecoder().decode(value));
            return new String(decryptedValue);
        } catch (Exception e) {
            throw new RuntimeException("Error decrypting API key", e);
        }
    }
}
