package com.project.property.entity;

import com.project.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import com.project.property.entity.Floor;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "wings")
public class Wing extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String wingName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @OneToMany(mappedBy = "wing", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Floor> floors;
}
