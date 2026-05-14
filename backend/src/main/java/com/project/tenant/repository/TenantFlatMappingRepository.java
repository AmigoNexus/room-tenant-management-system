package com.project.tenant.repository;

import com.project.tenant.entity.TenantFlatMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TenantFlatMappingRepository extends JpaRepository<TenantFlatMapping, Long> {
    Optional<TenantFlatMapping> findByFlatIdAndActiveTrue(Long flatId);
    Optional<TenantFlatMapping> findByTenantIdAndActiveTrue(Long tenantId);
}
