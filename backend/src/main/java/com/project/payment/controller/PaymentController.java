package com.project.payment.controller;

import com.project.common.ApiResponse;
import com.project.payment.dto.PaymentRequest;
import com.project.payment.dto.PaymentResponse;
import com.project.payment.entity.PaymentStatus;
import com.project.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService service;

    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(
            @Valid @RequestBody PaymentRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Payment created successfully",
                service.createPayment(request)
        ));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<PaymentResponse>> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam PaymentStatus status
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Payment status updated",
                service.updatePaymentStatus(id, status)
        ));
    }

    @PostMapping("/{id}/screenshot")
    public ResponseEntity<ApiResponse<PaymentResponse>> uploadScreenshot(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Screenshot uploaded successfully",
                service.uploadPaymentScreenshot(id, file)
        ));
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getHistory(@PathVariable Long tenantId) {
        return ResponseEntity.ok(ApiResponse.success("Payment history fetched", service.getPaymentHistoryByTenant(tenantId)));
    }

    @GetMapping("/due")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getDuePayments() {
        return ResponseEntity.ok(ApiResponse.success("Due payments fetched", service.getDuePayments()));
    }
}
