package com.project.payment.mapper;

import com.project.auth.entity.User;
import com.project.payment.dto.PaymentResponse;
import com.project.payment.entity.Payment;
import com.project.property.entity.Flat;
import com.project.tenant.entity.Tenant;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-14T12:57:32+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class PaymentMapperImpl implements PaymentMapper {

    @Override
    public PaymentResponse toPaymentResponse(Payment payment) {
        if ( payment == null ) {
            return null;
        }

        PaymentResponse.PaymentResponseBuilder paymentResponse = PaymentResponse.builder();

        paymentResponse.tenantId( paymentTenantId( payment ) );
        paymentResponse.tenantName( paymentTenantUserFullName( payment ) );
        paymentResponse.flatId( paymentFlatId( payment ) );
        paymentResponse.flatNumber( paymentFlatFlatNumber( payment ) );
        paymentResponse.depositAmount( payment.getDepositAmount() );
        paymentResponse.id( payment.getId() );
        paymentResponse.month( payment.getMonth() );
        paymentResponse.notes( payment.getNotes() );
        paymentResponse.paymentDate( payment.getPaymentDate() );
        paymentResponse.paymentScreenshot( payment.getPaymentScreenshot() );
        paymentResponse.paymentStatus( payment.getPaymentStatus() );
        paymentResponse.rentAmount( payment.getRentAmount() );
        paymentResponse.totalAmount( payment.getTotalAmount() );
        paymentResponse.year( payment.getYear() );

        return paymentResponse.build();
    }

    private Long paymentTenantId(Payment payment) {
        if ( payment == null ) {
            return null;
        }
        Tenant tenant = payment.getTenant();
        if ( tenant == null ) {
            return null;
        }
        Long id = tenant.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String paymentTenantUserFullName(Payment payment) {
        if ( payment == null ) {
            return null;
        }
        Tenant tenant = payment.getTenant();
        if ( tenant == null ) {
            return null;
        }
        User user = tenant.getUser();
        if ( user == null ) {
            return null;
        }
        String fullName = user.getFullName();
        if ( fullName == null ) {
            return null;
        }
        return fullName;
    }

    private Long paymentFlatId(Payment payment) {
        if ( payment == null ) {
            return null;
        }
        Flat flat = payment.getFlat();
        if ( flat == null ) {
            return null;
        }
        Long id = flat.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String paymentFlatFlatNumber(Payment payment) {
        if ( payment == null ) {
            return null;
        }
        Flat flat = payment.getFlat();
        if ( flat == null ) {
            return null;
        }
        String flatNumber = flat.getFlatNumber();
        if ( flatNumber == null ) {
            return null;
        }
        return flatNumber;
    }
}
