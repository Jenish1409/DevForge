package com.devforge.repository;

import com.devforge.entity.MockRequestLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MockRequestLogRepository extends JpaRepository<MockRequestLog, UUID> {

    List<MockRequestLog> findByProjectIdOrderByTimestampDesc(UUID projectId);

    void deleteByProjectId(UUID projectId);
}
