package com.devforge.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RateLimitingService {

    private final ConcurrentHashMap<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();

    private static final int MAX_REQUESTS_PER_MINUTE = 60;

    /**
     * Checks whether the given IP address has exceeded the rate limit.
     *
     * <p>Atomically increments the counter for the IP. Thread-safe via
     * {@link ConcurrentHashMap#computeIfAbsent} + {@link AtomicInteger#incrementAndGet}.
     *
     * @param ipAddress the client's IP address
     * @return {@code true} if the limit is exceeded, {@code false} otherwise
     */
    public boolean isRateLimited(String ipAddress) {
        AtomicInteger count = requestCounts.computeIfAbsent(ipAddress, k -> new AtomicInteger(0));
        return count.incrementAndGet() > MAX_REQUESTS_PER_MINUTE;
    }

    /**
     * Resets all IP counters every 60 seconds.
     */
    @Scheduled(fixedRate = 60000)
    public void resetCounters() {
        requestCounts.clear();
    }
}
