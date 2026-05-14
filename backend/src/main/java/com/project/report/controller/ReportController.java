package com.project.report.controller;

import com.project.common.ApiResponse;
import com.project.report.dto.OccupancyReport;
import com.project.report.dto.RevenueReport;
import com.project.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('OWNER')")
public class ReportController {

    private final ReportService service;

    @GetMapping("/revenue")
    public ResponseEntity<ApiResponse<List<RevenueReport>>> getRevenueReport(@RequestParam int year) {
        return ResponseEntity.ok(ApiResponse.success("Revenue report fetched", service.getMonthlyRevenueReport(year)));
    }

    @GetMapping("/occupancy")
    public ResponseEntity<ApiResponse<List<OccupancyReport>>> getOccupancyReport() {
        return ResponseEntity.ok(ApiResponse.success("Occupancy report fetched", service.getPropertyOccupancyReport()));
    }
}
