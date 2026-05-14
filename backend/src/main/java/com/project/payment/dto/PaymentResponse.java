package com.project.payment.dto;

import com.project.payment.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {
    private Long id;
    private Long tenantId;
    private String tenantName;
    private Long flatId;
    private String flatNumber;
    private String month;
    private int year;
    private BigDecimal rentAmount;
    private BigDecimal depositAmount;
    private BigDecimal totalAmount;
    private PaymentStatus paymentStatus;
    private LocalDateTime paymentDate;
    private String paymentScreenshot;
    private String notes;
}
