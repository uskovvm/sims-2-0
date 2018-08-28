package com.carddex.sims2.ws.service.model;

import java.util.Date;

/**
 * 
 * 
 */
public class EmployeeDto {

	private String firstName;
	private String lastName;
	private String middleName;
	private Date startDate;
	private String code;
	private String tabNumber;
	private String position;
	private Boolean isFired;
	private Boolean isDeleted;
	private String organizationCode;
	private String organizationName;
	private String phone;
	private String email;
	//

	public EmployeeDto() {
	}

	public EmployeeDto(String firstName, String middleName, String lastName, Date startDate, String code,
			String tabNumber, String position, Boolean isFired, Boolean isDeleted, String organizationCode,
			String organizationName, String phone, String email) {
		this.firstName = firstName;
		this.middleName = middleName;
		this.lastName = lastName;
		this.startDate = startDate;
		this.code = code;
		this.tabNumber = tabNumber;
		this.position = position;
		this.isFired = isFired;
		this.isDeleted = isDeleted;
		this.organizationCode = organizationCode;
		this.organizationName = organizationName;
		this.phone = phone;
		this.email = email;
	}

	//

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getMiddleName() {
		return middleName;
	}

	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getTabNumber() {
		return tabNumber;
	}

	public void setTabNumber(String tabNumber) {
		this.tabNumber = tabNumber;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public Boolean getIsFired() {
		return isFired;
	}

	public void setIsFired(Boolean isFired) {
		this.isFired = isFired;
	}

	public Boolean getIsDeleted() {
		return isDeleted;
	}

	public void setIsDeleted(Boolean isDeleted) {
		this.isDeleted = isDeleted;
	}

	public String getOrganizationCode() {
		return organizationCode;
	}

	public void setOrganizationCode(String organizationCode) {
		this.organizationCode = organizationCode;
	}

	public String getOrganizationName() {
		return organizationName;
	}

	public void setOrganizationName(String organizationName) {
		this.organizationName = organizationName;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public int hash() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((firstName == null) ? 0 : firstName.hashCode());
		result = prime * result + ((middleName == null) ? 0 : middleName.hashCode());
		result = prime * result + ((lastName == null) ? 0 : lastName.hashCode());
		result = prime * result + ((startDate == null) ? 0 : startDate.hashCode());
		result = prime * result + ((code == null) ? 0 : code.hashCode());
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