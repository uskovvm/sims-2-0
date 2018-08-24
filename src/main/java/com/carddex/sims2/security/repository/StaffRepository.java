package com.carddex.sims2.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.carddex.sims2.model.*;

public interface StaffRepository extends JpaRepository<Staff, Long> {
    
	@Query("select s from Staff s where s.name = :name")
	Staff findByName(String name);

	@Query("select s from Staff s where s.code = :code")
	Staff findByCode(String code);

}
