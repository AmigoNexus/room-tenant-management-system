package com.project.payment.repository;

import com.project.payment.entity.Payment;
import com.project.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByTenantId(Long tenantId);
    List<Payment> findByFlatId(Long flatId);
    List<Payment> findByPaymentStatus(PaymentStatus status);
}
