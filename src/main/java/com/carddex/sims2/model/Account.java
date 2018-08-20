package com.carddex.sims2.model;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The persistent class for the ACCOUNT database table.
 * 
 */
@Entity
public class Account implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "ID")
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(name = "AVATAR")
	private String avatar;

	@Column(name = "BLOCKED")
	private int blocked;

	@Column(name = "CARD_NUMBER")
	private int cardNumber;

	@Column(name = "DAY_SHEDULE_TYPE_ID")
	private int dayScheduleTypeId;

	@Column(name = "\"deleted\"")
	private int deleted;

	@Column(name = "DEPARTMENT_ID_1C")
	private int departmentId1C;

	@Column(name = "FIRED")
	private int fired;

	@Column(name = "FIRST_NAME")
	private String firstName;

	@Column(name = "GROUP_ID")
	private int groupId;

	@Column(name = "ID_1C")
	private int id1C;

	@Column(name = "INTERNAL_CARD_ID")
	private int internalCardId;

	@Column(name = "LAST_NAME")
	private String lastName;

	@Column(name = "MIDDLE_NAME")
	private String middleName;

	@Column(name = "ORGANIZATION_ID")
	private int organizationId;

	@Column(name = "ORGANIZATION_ID_1C")
	private int organizationId1C;

	@Column(name = "PHONE")
	private String phone;

	@Column(name = "POSITION")
	private String position;

	@Column(name = "SECRET_CODE")
	private String secretCode;

	@Column(name = "SYNC")
	private int sync;

	@ManyToOne
	@JoinColumn(name = "DEPARTMENT_ID", nullable = false)
	private Department department;

	//
	public Account() {
	}

	//
	public String getAvatar() {
		return this.avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

	public int getBlocked() {
		return this.blocked;
	}

	public void setBlocked(int blocked) {
		this.blocked = blocked;
	}

	public int getCardNumber() {
		return this.cardNumber;
	}

	public void setCardNumber(int cardNumber) {
		this.cardNumber = cardNumber;
	}

	public int getDayScheduleTypeId() {
		return this.dayScheduleTypeId;
	}

	public void setDayScheduleTypeId(int dayScheduleTypeId) {
		this.dayScheduleTypeId = dayScheduleTypeId;
	}

	public int getDeleted() {
		return this.deleted;
	}

	public void setDeleted(int deleted) {
		this.deleted = deleted;
	}

	// public int getDepartmentId() {
	// return this.departmentId;
	// }

	// public void setDepartmentId(int departmentId) {
	// this.departmentId = departmentId;
	// }

	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}

	public int getDepartmentId1C() {
		return this.departmentId1C;
	}

	public void setDepartmentId1C(int departmentId1C) {
		this.departmentId1C = departmentId1C;
	}

	public int getFired() {
		return this.fired;
	}

	public void setFired(int fired) {
		this.fired = fired;
	}

	public String getFirstName() {
		return this.firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public int getGroupId() {
		return this.groupId;
	}

	public void setGroupId(int groupId) {
		this.groupId = groupId;
	}

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public int getId1C() {
		return this.id1C;
	}

	public void setId1C(int id1C) {
		this.id1C = id1C;
	}

	public int getInternalCardId() {
		return this.internalCardId;
	}

	public void setInternalCardId(int internalCardId) {
		this.internalCardId = internalCardId;
	}

	public String getLastName() {
		return this.lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getMiddleName() {
		return this.middleName;
	}

	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}

	public int getOrganizationId() {
		return this.organizationId;
	}

	public void setOrganizationId(int organizationId) {
		this.organizationId = organizationId;
	}

	public int getOrganizationId1C() {
		return this.organizationId1C;
	}

	public void setOrganizationId1C(int organizationId1C) {
		this.organizationId1C = organizationId1C;
	}

	public String getPhone() {
		return this.phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getPosition() {
		return this.position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public String getSecretCode() {
		return this.secretCode;
	}

	public void setSecretCode(String secretCode) {
		this.secretCode = secretCode;
	}

	public int getSync() {
		return this.sync;
	}

	public void setSync(int sync) {
		this.sync = sync;
	}

}