package com.project.tenant.entity;

import com.project.common.BaseEntity;
import com.project.property.entity.Flat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tenant_flat_mappings")
public class TenantFlatMapping extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flat_id", nullable = false)
    private Flat flat;

    @Column(nullable = false)
    private LocalDate agreementStartDate;

    @Column(nullable = false)
    private LocalDate agreementEndDate;

    @Builder.Default
    private boolean active = true;
}
