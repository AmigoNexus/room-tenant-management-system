package com.project.property.dto;

import com.project.property.entity.FlatStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FlatRequest {
    @NotBlank(message = "Flat number is required")
    private String flatNumber;

    @NotNull(message = "Rent amount is required")
    @DecimalMin(value = "0.0", message = "Rent amount must be positive")
    private BigDecimal rentAmount;

    @NotNull(message = "Deposit amount is required")
    @DecimalMin(value = "0.0", message = "Deposit amount must be positive")
    private BigDecimal depositAmount;

    @NotNull(message = "Maintenance amount is required")
    @DecimalMin(value = "0.0", message = "Maintenance amount must be positive")
    private BigDecimal maintenanceAmount;

    @Builder.Default
    private FlatStatus status = FlatStatus.AVAILABLE;
}
