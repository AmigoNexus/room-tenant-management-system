package com.project.payment.dto;

import com.project.payment.entity.PaymentStatus;
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
public class PaymentRequest {
    @NotNull(message = "Tenant ID is required")
    private Long tenantId;

    @NotNull(message = "Flat ID is required")
    private Long flatId;

    @NotBlank(message = "Month is required")
    private String month;

    @NotNull(message = "Year is required")
    private Integer year;

    @NotNull(message = "Rent amount is required")
    @DecimalMin(value = "0.0")
    private BigDecimal rentAmount;

    private BigDecimal depositAmount;
    
    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0")
    private BigDecimal totalAmount;

    @NotNull(message = "Payment status is required")
    private PaymentStatus paymentStatus;

    private String notes;
}
