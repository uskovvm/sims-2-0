package com.carddex.sims2.rest.dto;

public class ProtocolDto {
	private Long id;// ид протокола
	private String name;// название протокола
	private String description;

	public ProtocolDto(Long id, String name, String description) {

		this.id = id;
		this.name = name;
		this.description = description;
	}
	//mutators
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
