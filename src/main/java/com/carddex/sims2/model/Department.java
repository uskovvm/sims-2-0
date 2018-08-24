package com.carddex.sims2.model;

import java.util.Collection;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "DEPARTMENT")
public class Department {

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "NAME", length = 150)
    private String name;

    @Column(name = "ID1C")
    private String code1C;

    @Column(name = "boss", length = 50)
    private String chief;

    @Column(name = "DESCRIPTION", length = 150)
    private String description;
    
    @Column(name = "DAYSHEDULETYPEID")
    private Integer dayScheduleTypeId;
    
    @Column(name = "BLOCKED")
    private Boolean blocked;

    @Column(name = "ORGANIZATIONID1C")
    private Integer organizationId1C;
    
    @ManyToMany(mappedBy = "departments")
    private Collection<Organization> organizations;
    
    @OneToMany(mappedBy="parent")
    private Set<Department> departments;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="parent_id", nullable=true)
    private Department parent;
    


	public Department() {}

    public Department(String code1C, String name, String chief) {
    	this.code1C = code1C;
    	this.name = name;
    	this.chief = chief;
	}

	//
    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getChief() {
		return chief;
	}

	public void setChief(String chief) {
		this.chief = chief;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Integer getDayScheduleTypeId() {
		return dayScheduleTypeId;
	}

	public void setDayScheduleTypeId(Integer dayScheduleTypeId) {
		this.dayScheduleTypeId = dayScheduleTypeId;
	}

	public Boolean getBlocked() {
		return blocked;
	}

	public void setBlocked(Boolean blocked) {
		this.blocked = blocked;
	}

	public String getCode1C() {
		return code1C;
	}

	public void setCode1C(String code1c) {
		code1C = code1c;
	}

	public Integer getOrganizationId1C() {
		return organizationId1C;
	}

	public void setOrganizationId1C(Integer organizationId1C) {
		this.organizationId1C = organizationId1C;
	}

	public Collection<Organization> getOrganizations() {
		return organizations;
	}

	public void setOrganizations(Collection<Organization> organizations) {
		this.organizations = organizations;
	}

	public Set<Department> getDepartments() {
		return departments;
	}

	public void setDepartments(Set<Department> items) {
		this.departments = items;
	}

	public Department getParent() {
		return parent;
	}

	public void setParent(Department department) {
		this.parent = department;
	}

	public int hash() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((code1C == null) ? 0 : code1C.hashCode());
		result = prime * result + ((chief == null) ? 0 : chief.hashCode());
		return result;
	}

	//
	
    @Override
    public String toString() {
    	return "id= " +id + "; код= " + code1C + "; название= " + name + "; начальник= " + chief;
    }
}
