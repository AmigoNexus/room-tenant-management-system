package com.project.tenant.mapper;

import com.project.tenant.dto.MappingResponse;
import com.project.tenant.entity.TenantFlatMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MappingMapper {

    @Mapping(target = "tenantId", source = "tenant.id")
    @Mapping(target = "tenantName", source = "tenant.user.fullName")
    @Mapping(target = "flatId", source = "flat.id")
    @Mapping(target = "flatNumber", source = "flat.flatNumber")
    MappingResponse toMappingResponse(TenantFlatMapping mapping);
}
