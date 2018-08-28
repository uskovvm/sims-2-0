package com.carddex.sims2.security.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.carddex.sims2.model.*;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

	
	@Query("select e from Employee e where e.code1C = :code")
	List<Employee> findByCode1C(String code);
}
