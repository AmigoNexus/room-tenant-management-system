package com.project.tenant.mapper;

import com.project.auth.entity.User;
import com.project.tenant.dto.TenantResponse;
import com.project.tenant.entity.Tenant;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-13T15:52:48+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class TenantMapperImpl implements TenantMapper {

    @Override
    public TenantResponse toTenantResponse(Tenant tenant) {
        if ( tenant == null ) {
            return null;
        }

        TenantResponse.TenantResponseBuilder tenantResponse = TenantResponse.builder();

        tenantResponse.userId( tenantUserId( tenant ) );
        tenantResponse.fullName( tenantUserFullName( tenant ) );
        tenantResponse.email( tenantUserEmail( tenant ) );
        tenantResponse.phone( tenantUserPhone( tenant ) );
        tenantResponse.address( tenant.getAddress() );
        tenantResponse.id( tenant.getId() );
        tenantResponse.idProof( tenant.getIdProof() );
        tenantResponse.occupation( tenant.getOccupation() );
        tenantResponse.profileImage( tenant.getProfileImage() );

        return tenantResponse.build();
    }

    private Long tenantUserId(Tenant tenant) {
        if ( tenant == null ) {
            return null;
        }
        User user = tenant.getUser();
        if ( user == null ) {
            return null;
        }
        Long id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String tenantUserFullName(Tenant tenant) {
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

    private String tenantUserEmail(Tenant tenant) {
        if ( tenant == null ) {
            return null;
        }
        User user = tenant.getUser();
        if ( user == null ) {
            return null;
        }
        String email = user.getEmail();
        if ( email == null ) {
            return null;
        }
        return email;
    }

    private String tenantUserPhone(Tenant tenant) {
        if ( tenant == null ) {
            return null;
        }
        User user = tenant.getUser();
        if ( user == null ) {
            return null;
        }
        String phone = user.getPhone();
        if ( phone == null ) {
            return null;
        }
        return phone;
    }
}
