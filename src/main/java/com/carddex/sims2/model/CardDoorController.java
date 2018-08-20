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
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author uvm
 */
@Entity
@Table(name = "CARD_DOOR_CONTROLLER")
@XmlRootElement
@NamedQueries({ @NamedQuery(name = "CardDoorController.findAll", query = "SELECT c FROM CardDoorController c"),
		@NamedQuery(name = "CardDoorController.findByCardNumber", query = "SELECT c FROM CardDoorController c WHERE c.cardNumber = :cardNumber"),
		@NamedQuery(name = "CardDoorController.findBySyncType", query = "SELECT c FROM CardDoorController c WHERE c.syncType = :syncType"),
		@NamedQuery(name = "CardDoorController.findBySync", query = "SELECT c FROM CardDoorController c WHERE c.sync = :sync") })
public class CardDoorController implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Basic(optional = false)
	@Column(name = "cardNumber")
	private int cardNumber;

	@Basic(optional = false)
	@Column(name = "syncType")
	private int syncType;

	@Basic(optional = false)
	@Column(name = "sync")
	private int sync;

	@JoinColumn(name = "deviceId", referencedColumnName = "id")
	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	private Device deviceId;

	public CardDoorController() {
	}


	//mutators
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public int getCardNumber() {
		return cardNumber;
	}

	public void setCardNumber(int cardNumber) {
		this.cardNumber = cardNumber;
	}

	public int getSyncType() {
		return syncType;
	}

	public void setSyncType(int syncType) {
		this.syncType = syncType;
	}

	public int getSync() {
		return sync;
	}

	public void setSync(int sync) {
		this.sync = sync;
	}

	public Device getDeviceId() {
		return deviceId;
	}

	public void setDeviceId(Device deviceId) {
		this.deviceId = deviceId;
	}

}
