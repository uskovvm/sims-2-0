package com.carddex.sims2.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carddex.sims2.model.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Department findByName(String name);
}
