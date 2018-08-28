package com.carddex.sims2.model;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
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
	@Column(name = "SHORT_NAME", length = 100)
	private String shortName;

    @OneToMany(mappedBy="group")
    private Set<Nomenclature> nomenclatures;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "group_id", nullable = true)
	private Nomenclature group;

	//
	public Nomenclature() {
	}

	public Nomenclature(String code, String name, String shortName, String parentName, String parentCode,
			Boolean isGroup) {
		this.code = code;
		this.name = name;
		this.shortName = shortName;

	}

	public Nomenclature(String code, String name, String shortName, Nomenclature group) {
		this.code = code;
		this.name = name;
		this.shortName = shortName;
		this.group = group;
	}

	public Nomenclature(String code, String name, String shortName) {
		this.code = code;
		this.name = name;
		this.shortName = shortName;
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

	public String getShortName() {
		return shortName;
	}

	public void setShortName(String shortName) {
		this.shortName = shortName;
	}

	public Nomenclature getGroup() {
		return group;
	}

	public void setGroup(Nomenclature group) {
		this.group = group;
	}

	public int hash() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((code == null) ? 0 : code.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((shortName == null) ? 0 : shortName.hashCode());
		return result;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((code == null) ? 0 : code.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((shortName == null) ? 0 : shortName.hashCode());
		result = prime * result + ((group == null) ? 0 : group.getCode().hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Nomenclature other = (Nomenclature) obj;
		if (code == null) {
			if (other.code != null)
				return false;
		} else if (!code.equals(other.code))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (shortName == null) {
			if (other.shortName != null)
				return false;
		} else if (!shortName.equals(other.shortName))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "id= " + id + "; code= " + code + "; name= " + name;
	}

}
