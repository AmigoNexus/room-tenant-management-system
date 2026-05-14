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
    List<WingResponse> getWingsByPropertyId(Long propertyId);
    
    FloorResponse addFloor(FloorRequest request);
    List<FloorResponse> getFloorsByWingId(Long wingId);
    
    FlatResponse addFlat(Long floorId, FlatRequest request);
    List<FlatResponse> getFlatsByFloorId(Long floorId);
}
