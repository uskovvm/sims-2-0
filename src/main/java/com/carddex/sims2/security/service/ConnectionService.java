package com.carddex.sims2.security.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.carddex.sims2.model.BaseConnection;
import com.carddex.sims2.model.ConnectionType;
import com.carddex.sims2.rest.dto.BaseConnectionDto;
import com.carddex.sims2.rest.dto.ConnectionTypeDto;
import com.carddex.sims2.rest.model.PortInfo;
import com.carddex.sims2.security.repository.ConnectionRepository;
import com.carddex.sims2.security.repository.ConnectionTypeRepository;

@Service
public class ConnectionService {

    @Autowired
    private ConnectionRepository repository;

    @Autowired
    private ConnectionTypeRepository connTypeRepository;

    public List<BaseConnectionDto> findAllConnection() {
    	
    	List<BaseConnectionDto> list = new ArrayList<>(); 
    	List<BaseConnection> result = repository.findAll();
    	for (BaseConnection conn : result) {
			list.add(new BaseConnectionDto(conn.getId(), conn.getTypeId(), conn.getName(), conn.getSysName(), conn.getBaudrate(),
			conn.getHost(), conn.getPort(), conn.getUser(), conn.getPassword(), conn.getDatabase(), conn.getEnabled()));
		}
        
        return list;
    }

	public List<ConnectionTypeDto> findAllConnectionType() {
    	List<ConnectionTypeDto> list = new ArrayList<>(); 
    	List<ConnectionType> result = connTypeRepository.findAll();
    	for (ConnectionType conn : result) {
			list.add(new ConnectionTypeDto(conn.getId(), conn.getName(), conn.getDescription(), conn.getIpRecuired(),
			conn.getIsDatabaseConnection()));
		}
        
        return list;
	}

	public List<PortInfo> findAllPorts() {
		List ports = new ArrayList();
		ports.add(new PortInfo("Port info", 1, "Port manufact", 1));
		return ports;
	}
}
