package com.carddex.sims2.rest.dto;

import java.util.Collection;
import java.util.List;

public class ZonesResp {

	private Pager pager;

	private Collection<ZoneDto> rows;

	public ZonesResp(List<ZoneDto> zones) {
		this.pager = new Pager(zones == null ? 0 : zones.size());
		this.rows = zones;
	}

	public Pager getPager() {
		return pager;
	}

	public void setPager(Pager pager) {
		this.pager = pager;
	}

	public Collection<ZoneDto> getRows() {
		return rows;
	}

	public void setRows(Collection<ZoneDto> rows) {
		this.rows = rows;
	}

}
