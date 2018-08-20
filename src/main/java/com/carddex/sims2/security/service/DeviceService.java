package com.carddex.sims2.security.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.carddex.sims2.model.Device;
import com.carddex.sims2.model.DeviceType;
import com.carddex.sims2.rest.dto.DeviceDto;
import com.carddex.sims2.rest.dto.DeviceTypeDto;
import com.carddex.sims2.rest.dto.PagedResponse;
import com.carddex.sims2.security.repository.DeviceRepository;
import com.carddex.sims2.security.repository.DeviceTypeRepository;

@Service
public class DeviceService {

	@Autowired
    private DeviceTypeRepository deviceTypeRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    public List<DeviceTypeDto> findAllDeviceType() {
    	
    	List<DeviceTypeDto> list = new ArrayList<>(); 
    	List<DeviceType> result = deviceTypeRepository.findAll();
    	for (DeviceType deviceType : result) {
			list.add(new DeviceTypeDto(deviceType.getId(), deviceType.getName(), deviceType.getDescription()));
		}
        
        return list;
    }

	public List<DeviceDto> findAllDevice() {

		List<DeviceDto> list = new ArrayList<>(); 
    	List<Device> result = deviceRepository.findAll();
    	Integer[]directionOpenMask = {new Integer(2),new Integer(2)};
    	for (Device device : result) {
			
    		list.add(new DeviceDto(device.getId(), device.getName(), device.getDescription(), device.getEnabled(),
    				device.getTypeId(), device.getConnectionId(), device.getProtocolId(),
    				new Integer(2), directionOpenMask,
    				device.getZoneAId(), device.getZoneBId(), device.getAccessModeAB(), device.getAccessModeBA()
    				));
		}
        
        return list;
	}

}
