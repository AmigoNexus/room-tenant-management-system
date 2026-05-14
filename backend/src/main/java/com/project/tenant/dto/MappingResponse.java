package com.project.tenant.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MappingResponse {
    private Long id;
    private Long tenantId;
    private String tenantName;
    private Long flatId;
    private String flatNumber;
    private LocalDate agreementStartDate;
    private LocalDate agreementEndDate;
    private boolean active;
}
