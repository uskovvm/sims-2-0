package com.carddex.sims2.rest.model;

public class PortInfo {

	private String sysName;
    private Integer pnpId;
    private String manufacturer;
    private Integer locationId;
	
    public PortInfo(String sysName, Integer pnpId, String manufacturer, Integer locationId) {
		super();
		this.sysName = sysName;
		this.pnpId = pnpId;
		this.manufacturer = manufacturer;
		this.locationId = locationId;
	}

	//mutators
    public String getSysName() {
		return sysName;
	}

	public void setSysName(String sysName) {
		this.sysName = sysName;
	}

	public Integer getPnpId() {
		return pnpId;
	}

	public void setPnpId(Integer pnpId) {
		this.pnpId = pnpId;
	}

	public String getManufacturer() {
		return manufacturer;
	}

	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
	}

	public Integer getLocationId() {
		return locationId;
	}

	public void setLocationId(Integer locationId) {
		this.locationId = locationId;
	}
}