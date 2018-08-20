package com.carddex.sims2.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "CONNECTION")
public class BaseConnection {

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "TYPEID")
    private Integer typeId;
    @Column(name = "NAME", length = 50)
    private String name;
    @Column(name = "SYSNAME", length = 50)
	private String sysName;
    @Column(name = "BAUDRATE")
	private Integer baudrate;
    @Column(name = "HOST", length = 50)
	private String host;
    @Column(name = "PORT")
	private Integer port;
	@Column(name = "SUSER", length = 50)
	private String user;
	@Column(name = "PASSWORD", length = 50)
	private String password;
	@Column(name = "DATABASE", length = 50)
	private String database;
	@Column(name = "ENABLED")
	private Integer enabled;
	
	
	public BaseConnection() {
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
