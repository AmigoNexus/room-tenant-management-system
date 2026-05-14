package com.project.tenant.controller;

import com.project.common.ApiResponse;
import com.project.tenant.dto.MappingRequest;
import com.project.tenant.dto.MappingResponse;
import com.project.tenant.service.MappingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/mappings")
@RequiredArgsConstructor
public class MappingController {

    private final MappingService service;

    @PostMapping("/assign")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<MappingResponse>> assignTenantToFlat(
            @Valid @RequestBody MappingRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Tenant assigned to flat successfully",
                service.assignTenantToFlat(request)
        ));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<Void>> removeTenantMapping(@PathVariable Long id) {
        service.removeTenantMapping(id);
        return ResponseEntity.ok(ApiResponse.success("Tenant mapping removed successfully", null));
    }

    @GetMapping("/flat/{flatId}")
    public ResponseEntity<ApiResponse<MappingResponse>> getActiveMappingByFlat(@PathVariable Long flatId) {
        return ResponseEntity.ok(ApiResponse.success("Mapping fetched successfully", service.getActiveMappingByFlat(flatId)));
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<ApiResponse<MappingResponse>> getActiveMappingByTenant(@PathVariable Long tenantId) {
        return ResponseEntity.ok(ApiResponse.success("Mapping fetched successfully", service.getActiveMappingByTenant(tenantId)));
    }
}
