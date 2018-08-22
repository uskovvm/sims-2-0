package com.carddex.sims2.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.carddex.sims2.model.*;

public interface NomenclatureRepository extends JpaRepository<Nomenclature, Long> {

	@Query("select n from Nomenclature n where n.code = :code")
	Nomenclature findByCode(String code);
}
