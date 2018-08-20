package com.carddex.sims2.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.carddex.sims2.rest.dto.BaseConnectionDto;
import com.carddex.sims2.rest.dto.ConnectionTypeDto;
import com.carddex.sims2.rest.dto.DeviceDto;
import com.carddex.sims2.rest.dto.DeviceTypeDto;
import com.carddex.sims2.rest.dto.PagedResponse;
import com.carddex.sims2.rest.dto.ProtocolDto;
import com.carddex.sims2.rest.model.PortInfo;
import com.carddex.sims2.security.service.ConnectionService;
import com.carddex.sims2.security.service.DeviceService;

@RestController
public class CoreRestController {

	@Value("${jwt.header}")
	private String tokenHeader;
	
	@Autowired
	private DeviceService deviceService;

	@Autowired
	private ConnectionService connectionService;
	
	@RequestMapping(value = "/core/api/device/types", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<DeviceTypeDto>> getDeviceTypes() {
		return ResponseEntity.status(HttpStatus.OK).body(deviceService.findAllDeviceType());
	}

	@RequestMapping(value = "/core/api/identification/types", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<DeviceTypeDto>> getIdentificationTypes() {

		List<DeviceTypeDto> list = new ArrayList<DeviceTypeDto>();
		list.add(new DeviceTypeDto(new Long(1), "id type 1", "identif type one"));
		return ResponseEntity.status(HttpStatus.OK).body(list);
	}

	@RequestMapping(value = "/core/api/protocols", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<ProtocolDto>> getProtocols() {

		List<ProtocolDto> list = new ArrayList<ProtocolDto>();
		list.add(new ProtocolDto(new Long(1), "protocol 1", "descr prot type one"));
		return ResponseEntity.status(HttpStatus.OK).body(list);
	}

	@RequestMapping(value = "/core/api/connections", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<BaseConnectionDto>> getConnections() {

		List<BaseConnectionDto> list = connectionService.findAllConnection();
		return ResponseEntity.status(HttpStatus.OK).body(list);
	}
	
	//
	@RequestMapping(value = "/core/api/connection/types", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<ConnectionTypeDto>> getConnectionTypes() {

		List<ConnectionTypeDto> list = connectionService.findAllConnectionType();
		return ResponseEntity.status(HttpStatus.OK).body(list);
	}
	
	//
	@RequestMapping(value = "/core/api/ports", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<PortInfo>> getPorts() {

		List<PortInfo> list = connectionService.findAllPorts();
		return ResponseEntity.status(HttpStatus.OK).body(list);
	}
	
	//
	@RequestMapping(value = "/acs/api/devices", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<PagedResponse> getDevices() {

		List<DeviceDto> list = deviceService.findAllDevice();
		PagedResponse response = new PagedResponse(list);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
	
}
