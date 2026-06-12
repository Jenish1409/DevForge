package com.devforge.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HexFormat;

/**
 * Utility for generating and hashing project API keys using deterministic SHA-256.
 *
 * <p>Unlike BCrypt, SHA-256 is deterministic — the same plaintext always produces
 * the same hash. This enables O(1) database lookups via {@code findByApiKeyHash}
 * without needing to load and compare every key individually.
 */
public final class ApiKeyUtil {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int KEY_LENGTH_BYTES = 32; // 256 bits → 64 hex chars

    private ApiKeyUtil() {
        // Utility class — no instantiation
    }

    /**
     * Generates a cryptographically secure random API key as a hex string.
     *
     * @return a 64-character hex string suitable for use as a plaintext API key
     */
    public static String generatePlaintextKey() {
        byte[] bytes = new byte[KEY_LENGTH_BYTES];
        SECURE_RANDOM.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    /**
     * Computes the SHA-256 hex digest of the given plaintext key.
     *
     * <p>This is deterministic: the same input always produces the same output,
     * which is critical for O(1) database index lookups on the hash column.
     *
     * @param plaintextKey the raw API key string
     * @return the lowercase hex-encoded SHA-256 hash (64 characters)
     */
    public static String sha256Hex(String plaintextKey) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(plaintextKey.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            // SHA-256 is required by every JVM — this can never happen in practice
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
