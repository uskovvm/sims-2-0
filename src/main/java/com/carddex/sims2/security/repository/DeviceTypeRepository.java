package com.carddex.sims2.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carddex.sims2.model.DeviceType;


public interface DeviceTypeRepository extends JpaRepository<DeviceType, Long> {
}
