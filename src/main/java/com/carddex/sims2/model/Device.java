/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.carddex.sims2.model;

import java.io.Serializable;
import java.util.Collection;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author uvm
 */
@Entity
@Table(name = "DEVICE")
public class Device implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "id")
    private Integer id;
    @Column(name = "name")
    private String name;
    @Column(name = "enabled")
    private Integer enabled;
    @Column(name = "SERIAL_NUMBER")
    private String serialNumber;
    @Column(name = "DESCRIPTION")
    private String description;
    @Column(name = "TYPE_ID")
    private Integer typeId;
    @Column(name = "CONNECTION_ID")
    private Integer connectionId;
    @Column(name = "PROTOCOL_ID")
    private Integer protocolId;
    @Column(name = "ADDR")
    private Integer addr;
    @Column(name = "IDX")
    private Integer idx;
    @Column(name = "IDENTIFICATION_TYPE_ID")
    private Integer identificationTypeId;
    @Column(name = "BROKEN")
    private Integer broken;
    @Column(name = "INVERT")
    private Integer invert;
    @Column(name = "WDT_CHANNEL")
    private Integer wdtChannel;
    @Column(name = "ZONE_ID")
    private Integer zoneId;
    @Column(name = "ZONE_AID")
    private Integer zoneAId;
    @Column(name = "ZONE_BID")
    private Integer zoneBId;
    @Column(name = "ACCESS_MODEAB")
    private Integer accessModeAB;
    @Column(name = "ACCESS_MODEBA")
    private Integer accessModeBA;
    @OneToOne(cascade = CascadeType.ALL, mappedBy = "device", fetch = FetchType.LAZY)
    private DeviceDoorController deviceDoorController;
    @OneToOne(cascade = CascadeType.ALL, mappedBy = "device", fetch = FetchType.LAZY)
    private DeviceEthController deviceEthController;
    @OneToOne(cascade = CascadeType.ALL, mappedBy = "device", fetch = FetchType.LAZY)
    private DeviceCamera deviceCamera;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "deviceId", fetch = FetchType.LAZY)
    private Collection<CardDoorController> cardDoorControllerCollection;

    public Device() {
    }

    public Device(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getEnabled() {
        return enabled;
    }

    public void setEnabled(Integer enabled) {
        this.enabled = enabled;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getTypeId() {
        return typeId;
    }

    public void setTypeId(Integer typeId) {
        this.typeId = typeId;
    }

    public Integer getConnectionId() {
        return connectionId;
    }

    public void setConnectionId(Integer connectionId) {
        this.connectionId = connectionId;
    }

    public Integer getProtocolId() {
        return protocolId;
    }

    public void setProtocolId(Integer protocolId) {
        this.protocolId = protocolId;
    }

    public Integer getAddr() {
        return addr;
    }

    public void setAddr(Integer addr) {
        this.addr = addr;
    }

    public Integer getIdx() {
        return idx;
    }

    public void setIdx(Integer idx) {
        this.idx = idx;
    }

    public Integer getIdentificationTypeId() {
        return identificationTypeId;
    }

    public void setIdentificationTypeId(Integer identificationTypeId) {
        this.identificationTypeId = identificationTypeId;
    }

    public Integer getBroken() {
        return broken;
    }

    public void setBroken(Integer broken) {
        this.broken = broken;
    }

    public Integer getInvert() {
        return invert;
    }

    public void setInvert(Integer invert) {
        this.invert = invert;
    }

    public Integer getWdtChannel() {
        return wdtChannel;
    }

    public void setWdtChannel(Integer wdtChannel) {
        this.wdtChannel = wdtChannel;
    }

    public Integer getZoneId() {
        return zoneId;
    }

    public void setZoneId(Integer zoneId) {
        this.zoneId = zoneId;
    }

    public Integer getZoneAId() {
        return zoneAId;
    }

    public void setZoneAId(Integer zoneAId) {
        this.zoneAId = zoneAId;
    }

    public Integer getZoneBId() {
        return zoneBId;
    }

    public void setZoneBId(Integer zoneBId) {
        this.zoneBId = zoneBId;
    }

    public Integer getAccessModeAB() {
        return accessModeAB;
    }

    public void setAccessModeAB(Integer accessModeAB) {
        this.accessModeAB = accessModeAB;
    }

    public Integer getAccessModeBA() {
        return accessModeBA;
    }

    public void setAccessModeBA(Integer accessModeBA) {
        this.accessModeBA = accessModeBA;
    }

    public DeviceDoorController getDeviceDoorController() {
        return deviceDoorController;
    }

    public void setDeviceDoorController(DeviceDoorController deviceDoorController) {
        this.deviceDoorController = deviceDoorController;
    }

    public DeviceEthController getDeviceEthController() {
        return deviceEthController;
    }

    public void setDeviceEthController(DeviceEthController deviceEthController) {
        this.deviceEthController = deviceEthController;
    }

    public DeviceCamera getDeviceCamera() {
        return deviceCamera;
    }

    public void setDeviceCamera(DeviceCamera deviceCamera) {
        this.deviceCamera = deviceCamera;
    }

    @XmlTransient
    public Collection<CardDoorController> getCardDoorControllerCollection() {
        return cardDoorControllerCollection;
    }

    public void setCardDoorControllerCollection(Collection<CardDoorController> cardDoorControllerCollection) {
        this.cardDoorControllerCollection = cardDoorControllerCollection;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Device)) {
            return false;
        }
        Device other = (Device) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "sqlitetopostgres.model.Device[ id=" + id + " ]";
    }
    
}
