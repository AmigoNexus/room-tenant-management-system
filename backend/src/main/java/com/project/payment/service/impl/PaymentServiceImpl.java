package com.project.payment.service.impl;

import com.project.exception.ResourceNotFoundException;
import com.project.payment.dto.PaymentRequest;
import com.project.payment.dto.PaymentResponse;
import com.project.payment.entity.Payment;
import com.project.payment.entity.PaymentStatus;
import com.project.payment.mapper.PaymentMapper;
import com.project.payment.repository.PaymentRepository;
import com.project.payment.service.PaymentService;
import com.project.property.entity.Flat;
import com.project.property.repository.FlatRepository;
import com.project.tenant.entity.Tenant;
import com.project.tenant.repository.TenantRepository;
import com.project.util.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final TenantRepository tenantRepository;
    private final FlatRepository flatRepository;
    private final PaymentMapper mapper;
    private final FileService fileService;

    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        Tenant tenant = tenantRepository.findById(request.getTenantId())
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));
        
        Flat flat = flatRepository.findById(request.getFlatId())
                .orElseThrow(() -> new ResourceNotFoundException("Flat not found"));

        Payment payment = Payment.builder()
                .tenant(tenant)
                .flat(flat)
                .month(request.getMonth())
                .year(request.getYear())
                .rentAmount(request.getRentAmount())
                .depositAmount(request.getDepositAmount())
                .totalAmount(request.getTotalAmount())
                .paymentStatus(request.getPaymentStatus())
                .notes(request.getNotes())
                .paymentDate(request.getPaymentStatus() == PaymentStatus.PAID ? LocalDateTime.now() : null)
                .build();

        return mapper.toPaymentResponse(paymentRepository.save(payment));
    }

    @Override
    @Transactional
    public PaymentResponse updatePaymentStatus(Long paymentId, PaymentStatus status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        
        payment.setPaymentStatus(status);
        if (status == PaymentStatus.PAID) {
            payment.setPaymentDate(LocalDateTime.now());
        }
        
        return mapper.toPaymentResponse(paymentRepository.save(payment));
    }

    @Override
    @Transactional
    public PaymentResponse uploadPaymentScreenshot(Long paymentId, MultipartFile file) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        try {
            String filePath = fileService.saveFile(file, "payments");
            payment.setPaymentScreenshot(filePath);
            return mapper.toPaymentResponse(paymentRepository.save(payment));
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload screenshot");
        }
    }

    @Override
    public List<PaymentResponse> getPaymentHistoryByTenant(Long tenantId) {
        return paymentRepository.findByTenantId(tenantId).stream()
                .map(mapper::toPaymentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentResponse> getDuePayments() {
        return paymentRepository.findByPaymentStatus(PaymentStatus.PENDING).stream()
                .map(mapper::toPaymentResponse)
                .collect(Collectors.toList());
    }
}
