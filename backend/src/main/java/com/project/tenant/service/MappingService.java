package com.project.tenant.service;

import com.project.tenant.dto.MappingRequest;
import com.project.tenant.dto.MappingResponse;

public interface MappingService {
    MappingResponse assignTenantToFlat(MappingRequest request);
    void removeTenantMapping(Long mappingId);
    MappingResponse getActiveMappingByFlat(Long flatId);
    MappingResponse getActiveMappingByTenant(Long tenantId);
}
