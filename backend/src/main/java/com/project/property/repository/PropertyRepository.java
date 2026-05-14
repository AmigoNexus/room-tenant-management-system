package com.project.property.repository;

import com.project.property.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {
    List<Property> findByOwnerId(Long ownerId);
    Page<Property> findByPropertyNameContainingIgnoreCaseOrAddressContainingIgnoreCase(String propertyName, String address, Pageable pageable);
}
