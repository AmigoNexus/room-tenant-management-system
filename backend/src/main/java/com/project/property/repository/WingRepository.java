package com.project.property.repository;

import com.project.property.entity.Wing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WingRepository extends JpaRepository<Wing, Long> {
    List<Wing> findByPropertyId(Long propertyId);
}
