package com.project.tenant.service.impl;

import com.project.auth.entity.User;
import com.project.exception.ResourceNotFoundException;
import com.project.tenant.dto.TenantRequest;
import com.project.tenant.dto.TenantResponse;
import com.project.tenant.entity.Tenant;
import com.project.tenant.mapper.TenantMapper;
import com.project.tenant.repository.TenantFlatMappingRepository;
import com.project.tenant.repository.TenantRepository;
import com.project.tenant.service.TenantService;
import com.project.util.FileService;
import com.project.auth.entity.Role;
import com.project.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TenantServiceImpl implements TenantService {

    private final TenantRepository repository;
    private final UserRepository userRepository;
    private final TenantMapper mapper;
    private final FileService fileService;
    private final PasswordEncoder passwordEncoder;
    private final TenantFlatMappingRepository mappingRepository;

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @Override
    @Transactional
    public TenantResponse createTenant(TenantRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new com.project.exception.BusinessException("Email already exists: " + request.getEmail());
        }
        
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.TENANT)
                .active(true)
                .build();
        
        user = userRepository.save(user);

        Tenant tenant = Tenant.builder()
                .user(user)
                .address(request.getAddress())
                .occupation(request.getOccupation())
                .build();

        return mapper.toTenantResponse(repository.save(tenant));
    }

    @Override
    @Transactional
    public TenantResponse createOrUpdateTenant(TenantRequest request) {
        User user = getCurrentUser();
        Tenant tenant = repository.findByUserId(user.getId())
                .orElse(Tenant.builder().user(user).build());

        updateTenantFields(tenant, request);
        
        return mapper.toTenantResponse(repository.save(tenant));
    }

    private void updateTenantFields(Tenant tenant, TenantRequest request) {
        if (request.getAddress() != null) tenant.setAddress(request.getAddress());
        if (request.getOccupation() != null) tenant.setOccupation(request.getOccupation());
        
        User user = tenant.getUser();
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new com.project.exception.BusinessException("Email already exists: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getActive() != null) user.setActive(request.getActive());
        
        userRepository.save(user);
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
        TenantResponse response = repository.findById(id)
                .map(mapper::toTenantResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));
        
        populateMappingInfo(response);
        return response;
    }

    private void populateMappingInfo(TenantResponse response) {
        mappingRepository.findByTenantIdAndActiveTrue(response.getId())
                .ifPresent(m -> {
                    response.setAssignedFlatNumber(m.getFlat().getFlatNumber());
                    response.setAssignedMappingId(m.getId());
                });
    }

    @Override
    public List<TenantResponse> getAllTenants() {
        return repository.findAll().stream()
                .map(t -> {
                    TenantResponse response = mapper.toTenantResponse(t);
                    populateMappingInfo(response);
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TenantResponse updateTenant(Long id, TenantRequest request) {
        Tenant tenant = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));
        
        updateTenantFields(tenant, request);
        
        return mapper.toTenantResponse(repository.save(tenant));
    }

    @Override
    @Transactional
    public void deleteTenant(Long id) {
        Tenant tenant = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));
        
        User user = tenant.getUser();
        repository.delete(tenant);
        userRepository.delete(user);
    }
}
