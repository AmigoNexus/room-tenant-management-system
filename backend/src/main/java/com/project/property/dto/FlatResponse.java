package com.project.property.dto;

import com.project.property.entity.FlatStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FlatResponse {
    private Long id;
    private String flatNumber;
    private BigDecimal rentAmount;
    private BigDecimal depositAmount;
    private BigDecimal maintenanceAmount;
    private FlatStatus status;
    private String flatType;
}
