package com.project.property.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FloorResponse {
    private Long id;
    private String floorName;
    private Long propertyId;
    private String propertyName;
    private Long wingId;
    private String wingName;
}
