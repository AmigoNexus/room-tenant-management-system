package com.project.tenant.service;

import com.project.tenant.dto.TenantRequest;
import com.project.tenant.dto.TenantResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TenantService {
    TenantResponse createTenant(TenantRequest request);
    TenantResponse createOrUpdateTenant(TenantRequest request);
    TenantResponse getTenantByUserId(Long userId);
    TenantResponse uploadProfileImage(MultipartFile file);
    TenantResponse uploadIdProof(MultipartFile file);
    TenantResponse getTenantById(Long id);
    List<TenantResponse> getAllTenants();
    TenantResponse updateTenant(Long id, TenantRequest request);
    void deleteTenant(Long id);
}
