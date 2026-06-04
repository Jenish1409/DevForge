package com.devforge.exception;

public class InvalidApiKeyException extends RuntimeException {

    public InvalidApiKeyException() {
        super("Invalid or missing API key. Provide a valid key via the X-API-Key header.");
    }
}
