package com.devforge.exception;

public class MockNotFoundException extends RuntimeException {

    public MockNotFoundException(String method, String path) {
        super("No mock endpoint found for " + method + " " + path);
    }
}
