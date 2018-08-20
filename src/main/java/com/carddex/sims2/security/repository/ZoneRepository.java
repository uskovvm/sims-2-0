package com.carddex.sims2.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.carddex.sims2.model.Zone;

public interface ZoneRepository extends JpaRepository<Zone, Long> {
    Zone findByName(String name);
}
