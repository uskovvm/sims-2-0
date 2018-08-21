package com.carddex.sims2.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "NOMENCLATURE")
public class Nomenclature implements Serializable {

	private static final long serialVersionUID = 1L;
	@Id
	@Column(name = "ID")
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	@Column(name = "CODE", length = 11)
	private String code;
	@Column(name = "NAME", length = 100)
	private String name;

//
	public Nomenclature() {
	}

	public Nomenclature(String code, String name) {
		this.code = code;
		this.name = name;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
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
	
	@Override
	public boolean equals(Object obj) {
		Nomenclature nomenclature = (Nomenclature)obj;
		if(code.equals(nomenclature.getCode()) && name.equals(nomenclature.getName()))
			return true;
		return false;
	}

}
