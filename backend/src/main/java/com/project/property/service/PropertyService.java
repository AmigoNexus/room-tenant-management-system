package com.project.property.service;

import com.project.property.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PropertyService {
    PropertyResponse addProperty(PropertyRequest request);
    PropertyResponse updateProperty(Long id, PropertyRequest request);
    void deleteProperty(Long id);
    PropertyResponse getPropertyById(Long id);
    Page<PropertyResponse> getAllProperties(Pageable pageable, String search);
    
    WingResponse addWing(WingRequest request);
    WingResponse updateWing(Long id, WingRequest request);
    void deleteWing(Long id);
    List<WingResponse> getWingsByPropertyId(Long propertyId);
    
    FloorResponse addFloor(FloorRequest request);
    FloorResponse updateFloor(Long id, FloorRequest request);
    void deleteFloor(Long id);
    List<FloorResponse> getFloorsByWingId(Long wingId);
    
    FlatResponse addFlat(Long floorId, FlatRequest request);
    FlatResponse updateFlat(Long id, FlatRequest request);
    void deleteFlat(Long id);
    List<FlatResponse> getFlatsByFloorId(Long floorId);
}
