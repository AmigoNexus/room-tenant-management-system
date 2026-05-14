package com.project.tenant.service.impl;

import com.project.exception.BusinessException;
import com.project.exception.ResourceNotFoundException;
import com.project.property.entity.Flat;
import com.project.property.entity.FlatStatus;
import com.project.property.repository.FlatRepository;
import com.project.tenant.dto.MappingRequest;
import com.project.tenant.dto.MappingResponse;
import com.project.tenant.entity.Tenant;
import com.project.tenant.entity.TenantFlatMapping;
import com.project.tenant.mapper.MappingMapper;
import com.project.tenant.repository.TenantFlatMappingRepository;
import com.project.tenant.repository.TenantRepository;
import com.project.tenant.service.MappingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MappingServiceImpl implements MappingService {

    private final TenantFlatMappingRepository mappingRepository;
    private final TenantRepository tenantRepository;
    private final FlatRepository flatRepository;
    private final MappingMapper mapper;

    @Override
    @Transactional
    public MappingResponse assignTenantToFlat(MappingRequest request) {
        Tenant tenant = tenantRepository.findById(request.getTenantId())
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));
        
        Flat flat = flatRepository.findById(request.getFlatId())
                .orElseThrow(() -> new ResourceNotFoundException("Flat not found"));

        if (flat.getStatus() == FlatStatus.OCCUPIED) {
            throw new BusinessException("Flat is already occupied");
        }

        mappingRepository.findByTenantIdAndActiveTrue(tenant.getId())
                .ifPresent(m -> {
                    throw new BusinessException("Tenant is already assigned to another flat");
                });

        TenantFlatMapping mapping = TenantFlatMapping.builder()
                .tenant(tenant)
                .flat(flat)
                .agreementStartDate(request.getAgreementStartDate())
                .agreementEndDate(request.getAgreementEndDate())
                .active(true)
                .build();

        flat.setStatus(FlatStatus.OCCUPIED);
        flatRepository.save(flat);

        return mapper.toMappingResponse(mappingRepository.save(mapping));
    }

    @Override
    @Transactional
    public void removeTenantMapping(Long mappingId) {
        TenantFlatMapping mapping = mappingRepository.findById(mappingId)
                .orElseThrow(() -> new ResourceNotFoundException("Mapping not found"));
        
        mapping.setActive(false);
        mappingRepository.save(mapping);

        Flat flat = mapping.getFlat();
        flat.setStatus(FlatStatus.AVAILABLE);
        flatRepository.save(flat);
    }

    @Override
    public MappingResponse getActiveMappingByFlat(Long flatId) {
        return mappingRepository.findByFlatIdAndActiveTrue(flatId)
                .map(mapper::toMappingResponse)
                .orElseThrow(() -> new ResourceNotFoundException("No active mapping found for this flat"));
    }

    @Override
    public MappingResponse getActiveMappingByTenant(Long tenantId) {
        return mappingRepository.findByTenantIdAndActiveTrue(tenantId)
                .map(mapper::toMappingResponse)
                .orElseThrow(() -> new ResourceNotFoundException("No active mapping found for this tenant"));
    }
}
