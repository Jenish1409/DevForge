package com.devforge.repository;

import com.devforge.entity.MonitoredApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MonitoredApiRepository extends JpaRepository<MonitoredApi, Long> {

    List<MonitoredApi> findByUserId(UUID userId);

    /**
     * Fetch all monitored APIs with their User eagerly loaded in a single JOIN query.
     * Prevents LazyInitializationException when the User is accessed on a
     * Reactor/Netty IO thread (outside the JPA session) in MonitoringEngine.
     */
    @Query("SELECT ma FROM MonitoredApi ma JOIN FETCH ma.user")
    List<MonitoredApi> findAllWithUser();
}
