package com.carddex.sims2.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carddex.sims2.model.BaseConnection;


public interface ConnectionRepository extends JpaRepository<BaseConnection, Long> {
}
