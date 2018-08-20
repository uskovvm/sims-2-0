package com.carddex.sims2.rest.dto;

import javax.persistence.Column;

public class BaseConnectionDto {

    private Long id;

    private Integer typeId;
    private String name;
	private String sysName;
	private Integer baudrate;
	private String host;
	private Integer port;
	private String user;
	private String password;
	private String database;
	private Integer enabled;
	
	public BaseConnectionDto(Long id, Integer typeId, String name, String sysName, Integer baudrate, String host,
			Integer port, String user, String password, String database, Integer enabled) {
		super();
		this.id = id;
		this.typeId = typeId;
		this.name = name;
		this.sysName = sysName;
		this.baudrate = baudrate;
		this.host = host;
		this.port = port;
		this.user = user;
		this.password = password;
		this.database = database;
		this.enabled = enabled;
	}


	//mutators
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getTypeId() {
		return typeId;
	}

	public void setTypeId(Integer typeId) {
		this.typeId = typeId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSysName() {
		return sysName;
	}

	public void setSysName(String sysName) {
		this.sysName = sysName;
	}

	public Integer getBaudrate() {
		return baudrate;
	}

	public void setBaudrate(Integer baudrate) {
		this.baudrate = baudrate;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public Integer getPort() {
		return port;
	}

	public void setPort(Integer port) {
		this.port = port;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getDatabase() {
		return database;
	}

	public void setDatabase(String database) {
		this.database = database;
	}

	public Integer getEnabled() {
		return enabled;
	}

	public void setEnabled(Integer enabled) {
		this.enabled = enabled;
	}
	
	
}
