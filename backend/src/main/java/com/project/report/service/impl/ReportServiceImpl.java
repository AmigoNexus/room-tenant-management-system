package com.project.report.service.impl;

import com.project.payment.entity.Payment;
import com.project.payment.entity.PaymentStatus;
import com.project.payment.repository.PaymentRepository;
import com.project.property.entity.FlatStatus;
import com.project.property.entity.Property;
import com.project.property.repository.PropertyRepository;
import com.project.report.dto.OccupancyReport;
import com.project.report.dto.RevenueReport;
import com.project.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final PaymentRepository paymentRepository;
    private final PropertyRepository propertyRepository;

    @Override
    public List<RevenueReport> getMonthlyRevenueReport(int year) {
        List<Payment> payments = paymentRepository.findAll().stream()
                .filter(p -> p.getYear() == year)
                .collect(Collectors.toList());

        Map<String, List<Payment>> groupedByMonth = payments.stream()
                .collect(Collectors.groupingBy(Payment::getMonth));

        List<RevenueReport> reports = new ArrayList<>();
        groupedByMonth.forEach((month, monthPayments) -> {
            BigDecimal totalRevenue = monthPayments.stream()
                    .filter(p -> p.getPaymentStatus() == PaymentStatus.PAID)
                    .map(Payment::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            long paidCount = monthPayments.stream()
                    .filter(p -> p.getPaymentStatus() == PaymentStatus.PAID)
                    .count();

            long pendingCount = monthPayments.stream()
                    .filter(p -> p.getPaymentStatus() == PaymentStatus.PENDING)
                    .count();

            reports.add(RevenueReport.builder()
                    .month(month)
                    .year(year)
                    .totalRevenue(totalRevenue)
                    .paidCount(paidCount)
                    .pendingCount(pendingCount)
                    .build());
        });

        return reports;
    }

    @Override
    public List<OccupancyReport> getPropertyOccupancyReport() {
        List<Property> properties = propertyRepository.findAll();
        
//        return properties.stream().map(property -> {
//            long totalFlats = property.getWings().stream()
//                    .flatMap(w -> w.getFlats().stream())
//                    .count();
//
//            long occupiedFlats = property.getWings().stream()
//                    .flatMap(w -> w.getFlats().stream())
//                    .filter(f -> f.getStatus() == FlatStatus.OCCUPIED)
//                    .count();

//            long availableFlats = totalFlats - occupiedFlats;
//            double rate = totalFlats > 0 ? (double) occupiedFlats / totalFlats * 100 : 0;
//
//            return OccupancyReport.builder()
//                    .propertyName(property.getPropertyName())
//                    .totalFlats(totalFlats)
//                    .occupiedFlats(occupiedFlats)
//                    .availableFlats(availableFlats)
//                    .occupancyRate(rate)
//                    .build();
//        }).collect(Collectors.toList());
        return null;
    }
}
