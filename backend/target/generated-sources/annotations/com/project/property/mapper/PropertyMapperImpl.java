package com.project.property.mapper;

import com.project.auth.entity.User;
import com.project.property.dto.FlatResponse;
import com.project.property.dto.FloorResponse;
import com.project.property.dto.PropertyResponse;
import com.project.property.dto.WingResponse;
import com.project.property.entity.Flat;
import com.project.property.entity.Floor;
import com.project.property.entity.Property;
import com.project.property.entity.Wing;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-14T14:03:21+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class PropertyMapperImpl implements PropertyMapper {

    @Override
    public PropertyResponse toPropertyResponse(Property property) {
        if ( property == null ) {
            return null;
        }

        PropertyResponse.PropertyResponseBuilder propertyResponse = PropertyResponse.builder();

        propertyResponse.ownerId( propertyOwnerId( property ) );
        propertyResponse.ownerName( propertyOwnerFullName( property ) );
        propertyResponse.wingsCount( property.getWingsCount() );
        propertyResponse.floorsCount( property.getFloorsCount() );
        propertyResponse.flatsCount( property.getFlatsCount() );
        propertyResponse.id( property.getId() );
        propertyResponse.propertyName( property.getPropertyName() );
        propertyResponse.address( property.getAddress() );
        propertyResponse.createdAt( property.getCreatedAt() );

        return propertyResponse.build();
    }

    @Override
    public WingResponse toWingResponse(Wing wing) {
        if ( wing == null ) {
            return null;
        }

        WingResponse.WingResponseBuilder wingResponse = WingResponse.builder();

        wingResponse.propertyId( wingPropertyId( wing ) );
        wingResponse.propertyName( wingPropertyPropertyName( wing ) );
        wingResponse.id( wing.getId() );
        wingResponse.wingName( wing.getWingName() );

        return wingResponse.build();
    }

    @Override
    public FloorResponse toFloorResponse(Floor floor) {
        if ( floor == null ) {
            return null;
        }

        FloorResponse.FloorResponseBuilder floorResponse = FloorResponse.builder();

        floorResponse.propertyId( floorPropertyId( floor ) );
        floorResponse.propertyName( floorPropertyPropertyName( floor ) );
        floorResponse.wingId( floorWingId( floor ) );
        floorResponse.wingName( floorWingWingName( floor ) );
        floorResponse.id( floor.getId() );
        floorResponse.floorName( floor.getFloorName() );

        return floorResponse.build();
    }

    @Override
    public FlatResponse toFlatResponse(Flat flat) {
        if ( flat == null ) {
            return null;
        }

        FlatResponse.FlatResponseBuilder flatResponse = FlatResponse.builder();

        flatResponse.id( flat.getId() );
        flatResponse.flatNumber( flat.getFlatNumber() );
        flatResponse.rentAmount( flat.getRentAmount() );
        flatResponse.depositAmount( flat.getDepositAmount() );
        flatResponse.maintenanceAmount( flat.getMaintenanceAmount() );
        flatResponse.status( flat.getStatus() );
        flatResponse.flatType( flat.getFlatType() );

        return flatResponse.build();
    }

    private Long propertyOwnerId(Property property) {
        if ( property == null ) {
            return null;
        }
        User owner = property.getOwner();
        if ( owner == null ) {
            return null;
        }
        Long id = owner.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String propertyOwnerFullName(Property property) {
        if ( property == null ) {
            return null;
        }
        User owner = property.getOwner();
        if ( owner == null ) {
            return null;
        }
        String fullName = owner.getFullName();
        if ( fullName == null ) {
            return null;
        }
        return fullName;
    }

    private Long wingPropertyId(Wing wing) {
        if ( wing == null ) {
            return null;
        }
        Property property = wing.getProperty();
        if ( property == null ) {
            return null;
        }
        Long id = property.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String wingPropertyPropertyName(Wing wing) {
        if ( wing == null ) {
            return null;
        }
        Property property = wing.getProperty();
        if ( property == null ) {
            return null;
        }
        String propertyName = property.getPropertyName();
        if ( propertyName == null ) {
            return null;
        }
        return propertyName;
    }

    private Long floorPropertyId(Floor floor) {
        if ( floor == null ) {
            return null;
        }
        Property property = floor.getProperty();
        if ( property == null ) {
            return null;
        }
        Long id = property.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String floorPropertyPropertyName(Floor floor) {
        if ( floor == null ) {
            return null;
        }
        Property property = floor.getProperty();
        if ( property == null ) {
            return null;
        }
        String propertyName = property.getPropertyName();
        if ( propertyName == null ) {
            return null;
        }
        return propertyName;
    }

    private Long floorWingId(Floor floor) {
        if ( floor == null ) {
            return null;
        }
        Wing wing = floor.getWing();
        if ( wing == null ) {
            return null;
        }
        Long id = wing.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String floorWingWingName(Floor floor) {
        if ( floor == null ) {
            return null;
        }
        Wing wing = floor.getWing();
        if ( wing == null ) {
            return null;
        }
        String wingName = wing.getWingName();
        if ( wingName == null ) {
            return null;
        }
        return wingName;
    }
}
