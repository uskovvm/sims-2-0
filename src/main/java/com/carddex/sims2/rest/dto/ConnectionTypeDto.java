package com.carddex.sims2.rest.dto;

public class ConnectionTypeDto {

	private Long id;
	private String name;
	private String description;
	private Integer ipRecuired;
	private Integer isDatabaseConnection;


	public ConnectionTypeDto(Long id, String name, String description, Integer ipRecuired,
			Integer isDatabaseConnection) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.ipRecuired = ipRecuired;
		this.isDatabaseConnection = isDatabaseConnection;
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

	public Integer getIpRecuired() {
		return ipRecuired;
	}

	public void setIpRecuired(Integer ipRecuired) {
		this.ipRecuired = ipRecuired;
	}

	public Integer getIsDatabaseConnection() {
		return isDatabaseConnection;
	}

	public void setIsDatabaseConnection(Integer isDatabaseConnection) {
		this.isDatabaseConnection = isDatabaseConnection;
	}
}
