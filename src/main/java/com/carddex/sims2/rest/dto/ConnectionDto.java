package com.carddex.sims2.rest.dto;

import java.util.Collection;

public class ConnectionDto {
	private Long id; // ид типа
	private String name; // название соединения
	private Boolean ip; // требуется ip
	private Collection<ProtocolDto> protocols; // досутпные протоколы

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

	public Boolean getIp() {
		return ip;
	}

	public void setIp(Boolean ip) {
		this.ip = ip;
	}

	public Collection<ProtocolDto> getProtocols() {
		return protocols;
	}

	public void setProtocols(Collection<ProtocolDto> protocols) {
		this.protocols = protocols;
	}
}
