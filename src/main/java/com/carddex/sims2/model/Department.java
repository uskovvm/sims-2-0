package com.carddex.sims2.model;

import java.util.Collection;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "DEPARTMENT")
public class Department {
	//CREATE TABLE "DEPARTMENT" ( id INTEGER, name TEXT, description TEXT, organizationId INTEGER, dayScheduleTypeId INTEGER, blocked INTEGER, id1C INTEGER, organizationId1C INTEGER, PRIMARY KEY(id), FOREIGN KEY (organizationId) REFERENCES Organization (id))
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "NAME", length = 50)
    private String name;

    @Column(name = "DESCRIPTION", length = 150)
    private String description;
    
    @Column(name = "DAYSHEDULETYPEID")
    private Integer dayScheduleTypeId;
    
    @Column(name = "BLOCKED")
    private Boolean blocked;

    @Column(name = "ID1C")
    private Integer id1C;
	
    @Column(name = "ORGANIZATIONID1C")
    private Integer organizationId1C;
    
    @ManyToMany(mappedBy = "departments")
    private Collection<Organization> organizations;
    


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

	public Integer getId1C() {
		return id1C;
	}

	public void setId1C(Integer id1c) {
		id1C = id1c;
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

}
