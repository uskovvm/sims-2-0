package com.carddex.sims2.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.carddex.sims2.model.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    
	@Query("select d from Department d where d.name = :name")
	Department findByName(String name);

	@Query("select d from Department d where d.code1C = :code")
	Department findByCode(String code);

}
