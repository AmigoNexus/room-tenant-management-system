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
public class WingRequest {
    @NotBlank(message = "Wing name is required")
    private String wingName;

    @NotNull(message = "Property ID is required")
    private Long propertyId;
}
