package com.project.property.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FloorRequest {
    @NotBlank(message = "Floor name is required")
    private String floorName;

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    @NotNull(message = "Wing ID is required")
    private Long wingId;
}
