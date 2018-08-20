package com.carddex.sims2.rest.dto;

import java.util.Collection;


public class OrganizationDto {

	private Long id;

	private String name;

	private String fullName;

	private String description;

	private Boolean blocked;

	private Integer id1C;

	private Collection<DepartmentDto> departments;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Boolean getBlocked() {
		return blocked;
	}

	public void setBlocked(Boolean blocked) {
		this.blocked = blocked;
	}

	public Integer getId1C() {
		return id1C;
	}

	public void setId1C(Integer id1c) {
		id1C = id1c;
	}

	public Collection<DepartmentDto> getDepartments() {
		return departments;
	}

	public void setDepartments(Collection<DepartmentDto> departments) {
		this.departments = departments;
	}

}
