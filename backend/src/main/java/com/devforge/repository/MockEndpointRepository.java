package com.devforge.repository;

import com.devforge.entity.MockEndpoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MockEndpointRepository extends JpaRepository<MockEndpoint, UUID> {

    List<MockEndpoint> findByProjectId(UUID projectId);

    List<MockEndpoint> findByProjectIdAndMethod(UUID projectId, String method);

    Optional<MockEndpoint> findByProjectIdAndMethodAndPath(UUID projectId, String method, String path);
}
