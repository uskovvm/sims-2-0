package com.carddex.sims2.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "STAFF_LIST")
public class Staff {

    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "CODE", length = 11)
    private String code;

    @Column(name = "NAME", length = 150)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="department_id", nullable=true)
    private Department department;
    

	public Staff() {}

	public Staff(String name, String departmentCode) {
		this.name = name;
		this.code = departmentCode;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}

	public int hash() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((code == null) ? 0 : code.hashCode());
		return result;
	}

    @Override
    public String toString() {
    	return "id= " +id + "; код= " + code + "; название= " + name;
    }
}
