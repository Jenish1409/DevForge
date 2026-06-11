package com.devforge.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpService {

    private final StringRedisTemplate stringRedisTemplate;

    private static final String OTP_PREFIX = "otp:";
    private static final Duration OTP_TTL = Duration.ofMinutes(5);
    private static final Duration RATE_LIMIT_WINDOW = Duration.ofSeconds(60);

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Generates a 6-digit OTP, stores it in Redis with a 5-minute TTL.
     * Throws if the key already exists and is less than 60 seconds old (rate limit).
     */
    public String generateAndStore(String email) {
        String key = OTP_PREFIX + email.toLowerCase();

        // Rate limiting: check if OTP was recently sent
        Long ttl = stringRedisTemplate.getExpire(key);
        if (ttl != null && ttl > 0) {
            long elapsed = OTP_TTL.toSeconds() - ttl;
            if (elapsed < RATE_LIMIT_WINDOW.toSeconds()) {
                long waitSeconds = RATE_LIMIT_WINDOW.toSeconds() - elapsed;
                throw new com.devforge.exception.RateLimitExceededException(
                        "OTP already sent. Please wait " + waitSeconds + " seconds before requesting again.");
            }
        }

        String otp = String.format("%06d", secureRandom.nextInt(1_000_000));
        stringRedisTemplate.opsForValue().set(key, otp, OTP_TTL);
        log.info("OTP generated for {}", email);
        return otp;
    }

    /**
     * Validates the OTP against Redis. On success, deletes the key (one-time use).
     * Returns true if the OTP matches, false otherwise.
     */
    public boolean validateAndConsume(String email, String otp) {
        String key = OTP_PREFIX + email.toLowerCase();
        String stored = stringRedisTemplate.opsForValue().get(key);

        if (stored == null) {
            return false; // expired or never existed
        }

        if (stored.equals(otp)) {
            stringRedisTemplate.delete(key); // one-time use
            log.info("OTP verified and consumed for {}", email);
            return true;
        }

        return false;
    }
}
