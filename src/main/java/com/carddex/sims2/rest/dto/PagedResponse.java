package com.carddex.sims2.rest.dto;

import java.util.Collection;
import java.util.List;

public class PagedResponse {

	private Pager pager;

	private Collection<?> rows;

	public PagedResponse(List<?> list) {
		this.pager = new Pager(list == null ? 0 : list.size());
		this.rows = list;
	}

	public Pager getPager() {
		return pager;
	}

	public void setPager(Pager pager) {
		this.pager = pager;
	}

	public Collection<?> getRows() {
		return rows;
	}

	public void setRows(Collection<?> rows) {
		this.rows = rows;
	}

}
