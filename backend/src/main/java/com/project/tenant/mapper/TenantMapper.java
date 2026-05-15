package com.project.tenant.mapper;

import com.project.tenant.dto.TenantResponse;
import com.project.tenant.entity.Tenant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TenantMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "fullName", source = "user.fullName")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "phone", source = "user.phone")
    @Mapping(target = "active", source = "user.active")
    @Mapping(target = "createdAt", expression = "java(tenant.getCreatedAt() != null ? tenant.getCreatedAt().toString() : null)")
    TenantResponse toTenantResponse(Tenant tenant);
}
