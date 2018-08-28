package com.carddex.sims2.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.*;

/**
 * 
 * 
 */
@Entity
public class Employee implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "ID")
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(name = "FIRST_NAME")
	private String firstName;

	@Column(name = "LAST_NAME")
	private String lastName;

	@Column(name = "MIDDLE_NAME")
	private String middleName;

	@Basic
	@Temporal(TemporalType.DATE)
	private Date startDate; 
	
	@Column(name = "CARD_NUMBER")
	private int cardNumber;

	@Column(name = "ID1C")
	private String code1C;
	
	@Column(name = "TAB_NUMBER")
	private String tabNumber;

	@Column(name = "AVATAR")
	private String avatar;

	@Column(name = "BLOCKED")
	private int blocked;

	@Column(name = "DELETED")
	private Boolean isDeleted;

	@Column(name = "FIRED")
	private Boolean isFired;

	@Column(name = "PHONE")
	private String phone;

	@Column(name = "EMAIL")
	private String email;

	@Column(name = "POSITION")
	private String position;

	@Column(name = "SECRET_CODE")
	private String secretCode;

	@ManyToOne
	@JoinColumn(name = "DEPARTMENT_ID", nullable = true)
	private Department department;

	@Column(name = "DAY_SHEDULE_TYPE_ID")
	private int dayScheduleTypeId;

	@Column(name = "GROUP_ID")
	private int groupId;

	@Column(name = "INTERNAL_CARD_ID")
	private int internalCardId;

	@Column(name = "SYNC")
	private int sync;

	@Column(name = "ORGANIZATION_ID")
	private int organizationId;

	@Column(name = "ORGANIZATION_ID_1C")
	private int organizationId1C;

	@Column(name = "DEPARTMENT_ID_1C")
	private int departmentId1C;

	//

	public Employee() {
	}

	public Employee(String firstName, String middleName, String lastName, Date startDate, String code, String tabNumber, 
			String position, Boolean isFired, Boolean isDeleted, String phone, String email) {
		this.firstName = firstName;
		this.middleName = middleName;
		this.lastName = lastName;
		this.startDate= startDate;
		this.code1C = code;
		this.tabNumber = tabNumber;
		this.position = position;
		this.isFired = isFired;
		this.isDeleted = isDeleted;
		this.phone = phone;
		this.email = email;
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

	public Boolean getDeleted() {
		return this.isDeleted;
	}

	public void setDeleted(Boolean deleted) {
		this.isDeleted = deleted;
	}

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

	public Boolean getFired() {
		return this.isFired;
	}

	public void setFired(Boolean fired) {
		this.isFired = fired;
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

	public String getId1C() {
		return this.code1C;
	}

	public void setId1C(String code1C) {
		this.code1C = code1C;
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

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public String getCode1C() {
		return code1C;
	}

	public void setCode1C(String code1c) {
		code1C = code1c;
	}

	public String getTabNumber() {
		return tabNumber;
	}

	public void setTabNumber(String tabNumber) {
		this.tabNumber = tabNumber;
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

	public Boolean getIsDeleted() {
		return isDeleted;
	}

	public void setIsDeleted(Boolean isDeleted) {
		this.isDeleted = isDeleted;
	}

	public Boolean getIsFired() {
		return isFired;
	}

	public void setIsFired(Boolean isFired) {
		this.isFired = isFired;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
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

	public int hash() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((firstName == null) ? 0 : firstName.hashCode());
		result = prime * result + ((middleName == null) ? 0 : middleName.hashCode());
		result = prime * result + ((lastName == null) ? 0 : lastName.hashCode());
		result = prime * result + ((startDate == null) ? 0 : startDate.hashCode());
		result = prime * result + ((code1C == null) ? 0 : code1C.hashCode());
		result = prime * result + ((tabNumber == null) ? 0 : tabNumber.hashCode());
		result = prime * result + ((position == null) ? 0 : position.hashCode());
		result = prime * result + ((isFired == null) ? 0 : isFired.hashCode());
		result = prime * result + ((isDeleted == null) ? 0 : isDeleted.hashCode());
		result = prime * result + ((phone == null) ? 0 : phone.hashCode());
		result = prime * result + ((email == null) ? 0 : email.hashCode());

		return result;
	}

	@Override
	public String toString() {
		return firstName + " " + middleName + " " + lastName + " " + position;
	}
}