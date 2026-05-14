package com.project.tenant.service.impl;

import com.project.auth.entity.User;
import com.project.exception.ResourceNotFoundException;
import com.project.tenant.dto.TenantRequest;
import com.project.tenant.dto.TenantResponse;
import com.project.tenant.entity.Tenant;
import com.project.tenant.mapper.TenantMapper;
import com.project.tenant.repository.TenantRepository;
import com.project.tenant.service.TenantService;
import com.project.util.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class TenantServiceImpl implements TenantService {

    private final TenantRepository repository;
    private final TenantMapper mapper;
    private final FileService fileService;

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @Override
    @Transactional
    public TenantResponse createOrUpdateTenant(TenantRequest request) {
        User user = getCurrentUser();
        Tenant tenant = repository.findByUserId(user.getId())
                .orElse(Tenant.builder().user(user).build());

        tenant.setAddress(request.getAddress());
        tenant.setOccupation(request.getOccupation());
        
        return mapper.toTenantResponse(repository.save(tenant));
    }

    @Override
    public TenantResponse getTenantByUserId(Long userId) {
        return repository.findByUserId(userId)
                .map(mapper::toTenantResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant details not found"));
    }

    @Override
    @Transactional
    public TenantResponse uploadProfileImage(MultipartFile file) {
        User user = getCurrentUser();
        Tenant tenant = repository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Tenant profile not found"));

        try {
            String filePath = fileService.saveFile(file, "profiles");
            tenant.setProfileImage(filePath);
            return mapper.toTenantResponse(repository.save(tenant));
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload profile image");
        }
    }

    @Override
    @Transactional
    public TenantResponse uploadIdProof(MultipartFile file) {
        User user = getCurrentUser();
        Tenant tenant = repository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Tenant profile not found"));

        try {
            String filePath = fileService.saveFile(file, "id_proofs");
            tenant.setIdProof(filePath);
            return mapper.toTenantResponse(repository.save(tenant));
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload ID proof");
        }
    }

    @Override
    public TenantResponse getTenantById(Long id) {
        return repository.findById(id)
                .map(mapper::toTenantResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));
    }
}
