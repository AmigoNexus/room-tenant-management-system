package com.project.payment.service;

import com.project.payment.dto.PaymentRequest;
import com.project.payment.dto.PaymentResponse;
import com.project.payment.entity.PaymentStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PaymentService {
    PaymentResponse createPayment(PaymentRequest request);
    PaymentResponse updatePaymentStatus(Long paymentId, PaymentStatus status);
    PaymentResponse uploadPaymentScreenshot(Long paymentId, MultipartFile file);
    List<PaymentResponse> getPaymentHistoryByTenant(Long tenantId);
    List<PaymentResponse> getDuePayments();
}
