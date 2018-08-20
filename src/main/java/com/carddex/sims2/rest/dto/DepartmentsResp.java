package com.carddex.sims2.rest.dto;

import java.util.Collection;
import java.util.List;

public class DepartmentsResp {

	private Pager pager;

	private Collection<DepartmentDto> rows;

	public DepartmentsResp(List<DepartmentDto> departments) {
		this.pager = new Pager(departments == null ? 0 : departments.size());
		this.rows = departments;
	}

	public Pager getPager() {
		return pager;
	}

	public void setPager(Pager pager) {
		this.pager = pager;
	}

	public Collection<DepartmentDto> getRows() {
		return rows;
	}

	public void setRows(Collection<DepartmentDto> rows) {
		this.rows = rows;
	}

}
