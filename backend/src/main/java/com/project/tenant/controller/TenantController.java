package com.project.tenant.controller;

import com.project.common.ApiResponse;
import com.project.tenant.dto.TenantRequest;
import com.project.tenant.dto.TenantResponse;
import com.project.tenant.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/tenants")
@RequiredArgsConstructor
public class TenantController {

    private final TenantService service;

    @PostMapping("/profile")
    public ResponseEntity<ApiResponse<TenantResponse>> updateProfile(@RequestBody TenantRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Tenant profile updated", service.createOrUpdateTenant(request)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<TenantResponse>> getMyProfile(@RequestParam Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Tenant profile fetched", service.getTenantByUserId(userId)));
    }

    @PostMapping("/upload-profile-image")
    public ResponseEntity<ApiResponse<TenantResponse>> uploadProfileImage(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.success("Profile image uploaded", service.uploadProfileImage(file)));
    }

    @PostMapping("/upload-id-proof")
    public ResponseEntity<ApiResponse<TenantResponse>> uploadIdProof(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.success("ID proof uploaded", service.uploadIdProof(file)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TenantResponse>> getTenantById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Tenant fetched successfully", service.getTenantById(id)));
    }
}
