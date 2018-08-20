package com.carddex.sims2.rest.dto;

public class DeviceTypeDto {

	private Long id; // ид типа оборудования
	private String name; // название девайса
	private String description;

	public DeviceTypeDto(Long id, String name, String description) {

		this.id = id;
		this.name = name;
		this.setDescription(description);
	}

	// mutators
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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
}
