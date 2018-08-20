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
@Table(name = "DEVICE_CAMERA")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "DeviceCamera.findAll", query = "SELECT d FROM DeviceCamera d")
    , @NamedQuery(name = "DeviceCamera.findByDeviceId", query = "SELECT d FROM DeviceCamera d WHERE d.deviceId = :deviceId")
    , @NamedQuery(name = "DeviceCamera.findBySysId", query = "SELECT d FROM DeviceCamera d WHERE d.sysId = :sysId")
    , @NamedQuery(name = "DeviceCamera.findByLogin", query = "SELECT d FROM DeviceCamera d WHERE d.login = :login")
    , @NamedQuery(name = "DeviceCamera.findByPassword", query = "SELECT d FROM DeviceCamera d WHERE d.password = :password")
    , @NamedQuery(name = "DeviceCamera.findByShotTimeout", query = "SELECT d FROM DeviceCamera d WHERE d.shotTimeout = :shotTimeout")})
public class DeviceCamera implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @Column(name = "deviceId")
    private Integer deviceId;
    @Column(name = "sysId")
    private String sysId;
    @Column(name = "login")
    private String login;
    @Column(name = "password")
    private String password;
    @Basic(optional = false)
    @Column(name = "shotTimeout")
    private int shotTimeout;
    @JoinColumn(name = "deviceId", referencedColumnName = "id", insertable = false, updatable = false)
    @OneToOne(optional = false, fetch = FetchType.LAZY)
    private Device device;

    public DeviceCamera() {
    }

    public DeviceCamera(Integer deviceId) {
        this.deviceId = deviceId;
    }

    public DeviceCamera(Integer deviceId, int shotTimeout) {
        this.deviceId = deviceId;
        this.shotTimeout = shotTimeout;
    }

    public Integer getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Integer deviceId) {
        this.deviceId = deviceId;
    }

    public String getSysId() {
        return sysId;
    }

    public void setSysId(String sysId) {
        this.sysId = sysId;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getShotTimeout() {
        return shotTimeout;
    }

    public void setShotTimeout(int shotTimeout) {
        this.shotTimeout = shotTimeout;
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
        if (!(object instanceof DeviceCamera)) {
            return false;
        }
        DeviceCamera other = (DeviceCamera) object;
        if ((this.deviceId == null && other.deviceId != null) || (this.deviceId != null && !this.deviceId.equals(other.deviceId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "sqlitetopostgres.model.DeviceCamera[ deviceId=" + deviceId + " ]";
    }
    
}
