package com.project.tenant.mapper;

import com.project.auth.entity.User;
import com.project.property.entity.Flat;
import com.project.tenant.dto.MappingResponse;
import com.project.tenant.entity.Tenant;
import com.project.tenant.entity.TenantFlatMapping;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-15T11:43:20+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.8 (Microsoft)"
)
@Component
public class MappingMapperImpl implements MappingMapper {

    @Override
    public MappingResponse toMappingResponse(TenantFlatMapping mapping) {
        if ( mapping == null ) {
            return null;
        }

        MappingResponse.MappingResponseBuilder mappingResponse = MappingResponse.builder();

        mappingResponse.tenantId( mappingTenantId( mapping ) );
        mappingResponse.tenantName( mappingTenantUserFullName( mapping ) );
        mappingResponse.flatId( mappingFlatId( mapping ) );
        mappingResponse.flatNumber( mappingFlatFlatNumber( mapping ) );
        mappingResponse.id( mapping.getId() );
        mappingResponse.agreementStartDate( mapping.getAgreementStartDate() );
        mappingResponse.agreementEndDate( mapping.getAgreementEndDate() );
        mappingResponse.active( mapping.isActive() );

        return mappingResponse.build();
    }

    private Long mappingTenantId(TenantFlatMapping tenantFlatMapping) {
        if ( tenantFlatMapping == null ) {
            return null;
        }
        Tenant tenant = tenantFlatMapping.getTenant();
        if ( tenant == null ) {
            return null;
        }
        Long id = tenant.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String mappingTenantUserFullName(TenantFlatMapping tenantFlatMapping) {
        if ( tenantFlatMapping == null ) {
            return null;
        }
        Tenant tenant = tenantFlatMapping.getTenant();
        if ( tenant == null ) {
            return null;
        }
        User user = tenant.getUser();
        if ( user == null ) {
            return null;
        }
        String fullName = user.getFullName();
        if ( fullName == null ) {
            return null;
        }
        return fullName;
    }

    private Long mappingFlatId(TenantFlatMapping tenantFlatMapping) {
        if ( tenantFlatMapping == null ) {
            return null;
        }
        Flat flat = tenantFlatMapping.getFlat();
        if ( flat == null ) {
            return null;
        }
        Long id = flat.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String mappingFlatFlatNumber(TenantFlatMapping tenantFlatMapping) {
        if ( tenantFlatMapping == null ) {
            return null;
        }
        Flat flat = tenantFlatMapping.getFlat();
        if ( flat == null ) {
            return null;
        }
        String flatNumber = flat.getFlatNumber();
        if ( flatNumber == null ) {
            return null;
        }
        return flatNumber;
    }
}
