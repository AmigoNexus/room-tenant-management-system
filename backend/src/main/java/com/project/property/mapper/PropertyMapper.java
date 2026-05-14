package com.project.property.mapper;

import com.project.property.dto.*;
import com.project.property.entity.Flat;
import com.project.property.entity.Floor;
import com.project.property.entity.Property;
import com.project.property.entity.Wing;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PropertyMapper {

    @Mapping(target = "ownerId", source = "owner.id")
    @Mapping(target = "ownerName", source = "owner.fullName")
    PropertyResponse toPropertyResponse(Property property);

    @Mapping(target = "propertyId", source = "property.id")
    @Mapping(target = "propertyName", source = "property.propertyName")
    WingResponse toWingResponse(Wing wing);

    @Mapping(target = "propertyId", source = "property.id")
    @Mapping(target = "propertyName", source = "property.propertyName")
    @Mapping(target = "wingId", source = "wing.id")
    @Mapping(target = "wingName", source = "wing.wingName")
    FloorResponse toFloorResponse(Floor floor);

    FlatResponse toFlatResponse(Flat flat);
}
