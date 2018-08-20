package com.carddex.sims2.model;

import java.util.Collection;
import javax.persistence.*;

@Entity
@Table(name = "ORGANIZATION")
public class Organization {
	// CREATE TABLE "ORGANIZATION" ( id INTEGER, name TEXT, fullName TEXT,
	// description TEXT, blocked INTEGER, id1C INTEGER, PRIMARY KEY (id) )
	@Id
	@Column(name = "ID")
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(name = "NAME", length = 50)
	private String name;

	@Column(name = "FULLNAME", length = 50)
	private String fullName;

	@Column(name = "DESCRIPTION", length = 150)
	private String description;

	@Column(name = "BLOCKED")
	private Boolean blocked;

	@Column(name = "ID1C")
	private Integer id1C;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "organization_departments", joinColumns = @JoinColumn(name = "organization_id", referencedColumnName = "id"), 
	inverseJoinColumns = @JoinColumn(name = "department_id", referencedColumnName = "id"))
	private Collection<Department> departments;

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

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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

	public Collection<Department> getDepartments() {
		return departments;
	}

	public void setDepartments(Collection<Department> departments) {
		this.departments = departments;
	}

}
