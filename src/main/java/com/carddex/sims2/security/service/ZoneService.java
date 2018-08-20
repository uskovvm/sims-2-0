package com.carddex.sims2.security.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.carddex.sims2.model.Zone;
import com.carddex.sims2.rest.dto.ZoneDto;
import com.carddex.sims2.rest.dto.ZonesResp;
import com.carddex.sims2.security.repository.ZoneRepository;

@Service
public class ZoneService {

	@Autowired
	private ZoneRepository repository;

	public ZonesResp loadAll() {
		List<Zone> zones = repository.findAll();
		List<ZoneDto> result = mapToDto(zones);
		
		return new ZonesResp(result);
	}

	private List<ZoneDto> mapToDto(List<Zone> zones) {
		List<ZoneDto> result = new ArrayList<ZoneDto>();
		for (Zone zone : zones) {
			result.add(new ZoneDto(zone.getId(), zone.getName(), zone.getDescription()));
		}
		return result;
	}

}
