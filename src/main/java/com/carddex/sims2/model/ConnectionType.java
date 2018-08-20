package com.carddex.sims2.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "CONNECTION_TYPE")
public class ConnectionType {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(name = "NAME", length = 50)
	private String name;
	
	@Column(name = "DESCRIPTION", length = 150)
	private String description;

	@Column(name = "IPREQUIRED")
	private Integer ipRecuired;
	
	@Column(name = "ISDATABASECONNECTION")
	private Integer isDatabaseConnection;
	
	//utators
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
