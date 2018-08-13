package com.carddex.sims2.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carddex.sims2.model.Module;

/**
 * 
 */
public interface ModuleRepository extends JpaRepository<Module, Long> {
    Module findByName(String name);
}
