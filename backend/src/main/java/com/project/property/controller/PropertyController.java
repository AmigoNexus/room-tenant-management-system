package com.project.property.controller;

import com.project.common.ApiResponse;
import com.project.property.dto.*;
import com.project.property.service.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService service;

    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<PropertyResponse>> addProperty(
            @Valid @RequestBody PropertyRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Property added successfully",
                service.addProperty(request)
        ));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<PropertyResponse>> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Property updated successfully",
                service.updateProperty(id, request)
        ));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(@PathVariable Long id) {
        service.deleteProperty(id);
        return ResponseEntity.ok(ApiResponse.success("Property deleted successfully", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Property fetched successfully", service.getPropertyById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PropertyResponse>>> getAllProperties(
            Pageable pageable,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(ApiResponse.success("Properties fetched successfully", service.getAllProperties(pageable, search)));
    }

    @PostMapping("/wings")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<WingResponse>> addWing(
            @Valid @RequestBody WingRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Wing added successfully", service.addWing(request)));
    }

    @GetMapping("/{propertyId}/wings")
    public ResponseEntity<ApiResponse<List<WingResponse>>> getWingsByPropertyId(@PathVariable Long propertyId) {
        return ResponseEntity.ok(ApiResponse.success("Wings fetched successfully", service.getWingsByPropertyId(propertyId)));
    }

    @PostMapping("/floors")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<FloorResponse>> addFloor(
            @Valid @RequestBody FloorRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Floor added successfully", service.addFloor(request)));
    }

    @GetMapping("/wings/{wingId}/floors")
    public ResponseEntity<ApiResponse<List<FloorResponse>>> getFloorsByWingId(@PathVariable Long wingId) {
        return ResponseEntity.ok(ApiResponse.success("Floors fetched successfully", service.getFloorsByWingId(wingId)));
    }

    @PostMapping("/floors/{floorId}/flats")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<FlatResponse>> addFlat(
            @PathVariable Long floorId,
            @Valid @RequestBody FlatRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Flat added successfully", service.addFlat(floorId, request)));
    }

    @GetMapping("/floors/{floorId}/flats")
    public ResponseEntity<ApiResponse<List<FlatResponse>>> getFlatsByFloorId(@PathVariable Long floorId) {
        return ResponseEntity.ok(ApiResponse.success("Flats fetched successfully", service.getFlatsByFloorId(floorId)));
    }
}
