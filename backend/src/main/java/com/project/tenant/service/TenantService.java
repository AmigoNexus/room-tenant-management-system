package com.project.tenant.service;

import com.project.tenant.dto.TenantRequest;
import com.project.tenant.dto.TenantResponse;
import org.springframework.web.multipart.MultipartFile;

public interface TenantService {
    TenantResponse createOrUpdateTenant(TenantRequest request);
    TenantResponse getTenantByUserId(Long userId);
    TenantResponse uploadProfileImage(MultipartFile file);
    TenantResponse uploadIdProof(MultipartFile file);
    TenantResponse getTenantById(Long id);
}
