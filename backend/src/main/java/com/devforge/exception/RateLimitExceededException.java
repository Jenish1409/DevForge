package com.devforge.exception;

public class RateLimitExceededException extends RuntimeException {

    public RateLimitExceededException(String ipAddress) {
        super("Rate limit exceeded for IP: " + ipAddress + ". Maximum 60 requests per minute.");
    }
}
