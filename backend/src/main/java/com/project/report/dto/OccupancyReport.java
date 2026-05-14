package com.project.report.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OccupancyReport {
    private String propertyName;
    private long totalFlats;
    private long occupiedFlats;
    private long availableFlats;
    private double occupancyRate;
}
