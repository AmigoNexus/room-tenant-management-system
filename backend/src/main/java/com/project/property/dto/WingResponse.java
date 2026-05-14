package com.project.property.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WingResponse {
    private Long id;
    private String wingName;
    private Long propertyId;
    private String propertyName;
}
