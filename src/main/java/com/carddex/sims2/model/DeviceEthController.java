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
@Table(name = "DEVICE_ETH_CONTROLLER")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "DeviceEthController.findAll", query = "SELECT d FROM DeviceEthController d")
    , @NamedQuery(name = "DeviceEthController.findByDeviceId", query = "SELECT d FROM DeviceEthController d WHERE d.deviceId = :deviceId")
    , @NamedQuery(name = "DeviceEthController.findByDbConnectionId", query = "SELECT d FROM DeviceEthController d WHERE d.dbConnectionId = :dbConnectionId")})
public class DeviceEthController implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @Column(name = "deviceId")
    private Integer deviceId;
    @Column(name = "dbConnectionId")
    private Integer dbConnectionId;
    @JoinColumn(name = "deviceId", referencedColumnName = "id", insertable = false, updatable = false)
    @OneToOne(optional = false, fetch = FetchType.LAZY)
    private Device device;

    public DeviceEthController() {
    }

    public DeviceEthController(Integer deviceId) {
        this.deviceId = deviceId;
    }

    public Integer getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Integer deviceId) {
        this.deviceId = deviceId;
    }

    public Integer getDbConnectionId() {
        return dbConnectionId;
    }

    public void setDbConnectionId(Integer dbConnectionId) {
        this.dbConnectionId = dbConnectionId;
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
        if (!(object instanceof DeviceEthController)) {
            return false;
        }
        DeviceEthController other = (DeviceEthController) object;
        if ((this.deviceId == null && other.deviceId != null) || (this.deviceId != null && !this.deviceId.equals(other.deviceId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "sqlitetopostgres.model.DeviceEthController[ deviceId=" + deviceId + " ]";
    }
    
}
