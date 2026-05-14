package com.project.property.repository;

import com.project.property.entity.Flat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlatRepository extends JpaRepository<Flat, Long> {
    List<Flat> findByFloorId(Long floorId);
}
