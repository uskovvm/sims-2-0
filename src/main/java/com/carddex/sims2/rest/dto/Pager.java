package com.carddex.sims2.rest.dto;

public class Pager {
	
	private Integer totalRows;

	public Pager(int size) {
		this.totalRows = size;
	}

	public Integer getTotalRows() {
		return totalRows;
	}

	public void setTotalRows(Integer totalRows) {
		this.totalRows = totalRows;
	}
}
