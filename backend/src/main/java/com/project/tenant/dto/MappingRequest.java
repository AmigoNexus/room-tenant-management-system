package com.project.tenant.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MappingRequest {
    @NotNull(message = "Tenant ID is required")
    private Long tenantId;

    @NotNull(message = "Flat ID is required")
    private Long flatId;

    @NotNull(message = "Agreement start date is required")
    private LocalDate agreementStartDate;

    @NotNull(message = "Agreement end date is required")
    private LocalDate agreementEndDate;
}
