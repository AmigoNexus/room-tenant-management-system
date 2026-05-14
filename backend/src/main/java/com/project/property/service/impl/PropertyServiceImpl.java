package com.project.property.service.impl;

import com.project.auth.entity.User;
import com.project.exception.ResourceNotFoundException;
import com.project.auth.entity.User;
import com.project.exception.ResourceNotFoundException;
import com.project.property.dto.*;
import com.project.property.entity.Flat;
import com.project.property.entity.Floor;
import com.project.property.entity.Property;
import com.project.property.entity.Wing;
import com.project.property.mapper.PropertyMapper;
import com.project.property.repository.FlatRepository;
import com.project.property.repository.FloorRepository;
import com.project.property.repository.PropertyRepository;
import com.project.property.repository.WingRepository;
import com.project.property.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final WingRepository wingRepository;
    private final FloorRepository floorRepository;
    private final FlatRepository flatRepository;
    private final PropertyMapper mapper;

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @Override
    @Transactional
    public PropertyResponse addProperty(PropertyRequest request) {
        User user = getCurrentUser();
        Property property = Property.builder()
                .propertyName(request.getPropertyName())
                .address(request.getAddress())
                .owner(user)
                .build();
        return mapper.toPropertyResponse(propertyRepository.save(property));
    }

    @Override
    @Transactional
    public PropertyResponse updateProperty(Long id, PropertyRequest request) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        property.setPropertyName(request.getPropertyName());
        property.setAddress(request.getAddress());

        return mapper.toPropertyResponse(propertyRepository.save(property));
    }

    @Override
    @Transactional
    public void deleteProperty(Long id) {
        if (!propertyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Property not found");
        }
        propertyRepository.deleteById(id);
    }

    @Override
    public PropertyResponse getPropertyById(Long id) {
        return propertyRepository.findById(id)
                .map(mapper::toPropertyResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
    }

    @Override
    public Page<PropertyResponse> getAllProperties(Pageable pageable, String search) {
        return propertyRepository.findAll(pageable).map(mapper::toPropertyResponse);
    }

    @Override
    @Transactional
    public WingResponse addWing(WingRequest request) {
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        Wing wing = Wing.builder()
                .wingName(request.getWingName())
                .property(property)
                .build();

        return mapper.toWingResponse(wingRepository.save(wing));
    }

    @Override
    public List<WingResponse> getWingsByPropertyId(Long propertyId) {
        return wingRepository.findByPropertyId(propertyId).stream()
                .map(mapper::toWingResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FloorResponse addFloor(FloorRequest request) {
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        Wing wing = wingRepository.findById(request.getWingId())
                .orElseThrow(() -> new ResourceNotFoundException("Wing not found"));

        Floor floor = Floor.builder()
                .floorName(request.getFloorName())
                .property(property)
                .wing(wing)
                .build();

        return mapper.toFloorResponse(floorRepository.save(floor));
    }

    @Override
    public List<FloorResponse> getFloorsByWingId(Long wingId) {
        return floorRepository.findByWingId(wingId).stream()
                .map(mapper::toFloorResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FlatResponse addFlat(Long floorId, FlatRequest request) {
        Floor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found"));

        Flat flat = Flat.builder()
                .flatNumber(request.getFlatNumber())
                .rentAmount(request.getRentAmount())
                .depositAmount(request.getDepositAmount())
                .maintenanceAmount(request.getMaintenanceAmount())
                .status(request.getStatus())
                .floor(floor)
                .build();

        return mapper.toFlatResponse(flatRepository.save(flat));
    }

    @Override
    public List<FlatResponse> getFlatsByFloorId(Long floorId) {
        return flatRepository.findByFloorId(floorId).stream()
                .map(mapper::toFlatResponse)
                .collect(Collectors.toList());
    }
}

