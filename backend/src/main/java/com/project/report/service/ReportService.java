package com.project.report.service;

import com.project.report.dto.OccupancyReport;
import com.project.report.dto.RevenueReport;

import java.util.List;

public interface ReportService {
    List<RevenueReport> getMonthlyRevenueReport(int year);
    List<OccupancyReport> getPropertyOccupancyReport();
}
