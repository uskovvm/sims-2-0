/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.carddex.sims2.model;

import java.io.Serializable;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author uvm
 */
@Entity
@Table(name = "DEVICE_DOOR_CONTROLLER")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "DeviceDoorController.findAll", query = "SELECT d FROM DeviceDoorController d")
    , @NamedQuery(name = "DeviceDoorController.findByDeviceId", query = "SELECT d FROM DeviceDoorController d WHERE d.deviceId = :deviceId")
    , @NamedQuery(name = "DeviceDoorController.findBySyncTimeout", query = "SELECT d FROM DeviceDoorController d WHERE d.syncTimeout = :syncTimeout")
    , @NamedQuery(name = "DeviceDoorController.findByLastSyncTime", query = "SELECT d FROM DeviceDoorController d WHERE d.lastSyncTime = :lastSyncTime")
    , @NamedQuery(name = "DeviceDoorController.findByReset", query = "SELECT d FROM DeviceDoorController d WHERE d.reset = :reset")})
public class DeviceDoorController implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @Column(name = "deviceId")
    private Integer deviceId;
    @Column(name = "syncTimeout")
    private Integer syncTimeout;
    @Column(name = "lastSyncTime")
    private Integer lastSyncTime;
    @Basic(optional = false)
    @Column(name = "reset")
    private int reset;
    @JoinColumn(name = "deviceId", referencedColumnName = "id", insertable = false, updatable = false)
    @OneToOne(optional = false, fetch = FetchType.LAZY)
    private Device device;

    public DeviceDoorController() {
    }

    public DeviceDoorController(Integer deviceId) {
        this.deviceId = deviceId;
    }

    public DeviceDoorController(Integer deviceId, int reset) {
        this.deviceId = deviceId;
        this.reset = reset;
    }

    public Integer getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Integer deviceId) {
        this.deviceId = deviceId;
    }

    public Integer getSyncTimeout() {
        return syncTimeout;
    }

    public void setSyncTimeout(Integer syncTimeout) {
        this.syncTimeout = syncTimeout;
    }

    public Integer getLastSyncTime() {
        return lastSyncTime;
    }

    public void setLastSyncTime(Integer lastSyncTime) {
        this.lastSyncTime = lastSyncTime;
    }

    public int getReset() {
        return reset;
    }

    public void setReset(int reset) {
        this.reset = reset;
    }

    public Device getDevice() {
        return device;
    }

    public void setDevice(Device device) {
        this.device = device;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (deviceId != null ? deviceId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof DeviceDoorController)) {
            return false;
        }
        DeviceDoorController other = (DeviceDoorController) object;
        if ((this.deviceId == null && other.deviceId != null) || (this.deviceId != null && !this.deviceId.equals(other.deviceId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "sqlitetopostgres.model.DeviceDoorController[ deviceId=" + deviceId + " ]";
    }
    
}
