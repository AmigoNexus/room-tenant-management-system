package com.project.property.service.impl;

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
        if (search != null && !search.isEmpty()) {
            return propertyRepository.findByPropertyNameContainingIgnoreCaseOrAddressContainingIgnoreCase(search, search, pageable)
                    .map(mapper::toPropertyResponse);
        }
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
        property.setWingsCount(property.getWingsCount() + 1);
        propertyRepository.save(property);
        return mapper.toWingResponse(wingRepository.save(wing));
    }

    @Override
    @Transactional
    public WingResponse updateWing(Long id, WingRequest request) {
        Wing wing = wingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wing not found"));
        wing.setWingName(request.getWingName());
        return mapper.toWingResponse(wingRepository.save(wing));
    }

    @Override
    @Transactional
    public void deleteWing(Long id) {
        Wing wing = wingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wing not found"));
        
        Property property = wing.getProperty();
        
        // Calculate counts to reduce
        long floorsInWing = wing.getFloors().size();
        long flatsInWing = wing.getFloors().stream()
                .mapToLong(floor -> floor.getFlats().size())
                .sum();
        
        property.setWingsCount(Math.max(0, property.getWingsCount() - 1));
        property.setFloorsCount(Math.max(0, property.getFloorsCount() - (int) floorsInWing));
        property.setFlatsCount(Math.max(0, property.getFlatsCount() - (int) flatsInWing));
        
        propertyRepository.save(property);
        wingRepository.delete(wing);
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
        property.setFloorsCount(property.getFloorsCount() + 1);
        propertyRepository.save(property);
        return mapper.toFloorResponse(floorRepository.save(floor));
    }

    @Override
    @Transactional
    public FloorResponse updateFloor(Long id, FloorRequest request) {
        Floor floor = floorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found"));
        floor.setFloorName(request.getFloorName());
        return mapper.toFloorResponse(floorRepository.save(floor));
    }

    @Override
    @Transactional
    public void deleteFloor(Long id) {
        Floor floor = floorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Floor not found"));
        
        Property property = floor.getProperty();
        long flatsInFloor = floor.getFlats().size();
        
        property.setFloorsCount(Math.max(0, property.getFloorsCount() - 1));
        property.setFlatsCount(Math.max(0, property.getFlatsCount() - (int) flatsInFloor));
        
        propertyRepository.save(property);
        floorRepository.delete(floor);
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
        Property property = floor.getProperty();
        property.setFlatsCount(property.getFlatsCount() + 1);
        propertyRepository.save(property);

        Flat flat = Flat.builder()
                .flatNumber(request.getFlatNumber())
                .rentAmount(request.getRentAmount())
                .depositAmount(request.getDepositAmount())
                .maintenanceAmount(request.getMaintenanceAmount())
                .status(request.getStatus())
                .flatType(request.getFlatType())
                .floor(floor)
                .build();

        return mapper.toFlatResponse(flatRepository.save(flat));
    }

    @Override
    @Transactional
    public FlatResponse updateFlat(Long id, FlatRequest request) {
        Flat flat = flatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flat not found"));
        
        flat.setFlatNumber(request.getFlatNumber());
        flat.setRentAmount(request.getRentAmount());
        flat.setDepositAmount(request.getDepositAmount());
        flat.setMaintenanceAmount(request.getMaintenanceAmount());
        flat.setStatus(request.getStatus());
        flat.setFlatType(request.getFlatType());
        
        return mapper.toFlatResponse(flatRepository.save(flat));
    }

    @Override
    @Transactional
    public void deleteFlat(Long id) {
        Flat flat = flatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flat not found"));
        
        Property property = flat.getFloor().getProperty();
        property.setFlatsCount(Math.max(0, property.getFlatsCount() - 1));
        
        propertyRepository.save(property);
        flatRepository.delete(flat);
    }

    @Override
    public List<FlatResponse> getFlatsByFloorId(Long floorId) {
        return flatRepository.findByFloorId(floorId).stream()
                .map(mapper::toFlatResponse)
                .collect(Collectors.toList());
    }
}

