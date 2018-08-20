package com.carddex.sims2.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "DEVICE_TYPE")
public class DeviceType {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "TYPENAME", length = 50)
    private String name;

    @Column(name = "TYPESHORTNAME", length = 50)
    private String typeShortName;

    @Column(name = "TYPEDESCRIPTION", length = 150)
    private String description;

	
    //mutators
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

	public String getTypeShortName() {
		return typeShortName;
	}

	public void setTypeShortName(String typeShortName) {
		this.typeShortName = typeShortName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
}
