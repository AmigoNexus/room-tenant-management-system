package com.project.report.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RevenueReport {
    private String month;
    private int year;
    private BigDecimal totalRevenue;
    private long paidCount;
    private long pendingCount;
}
