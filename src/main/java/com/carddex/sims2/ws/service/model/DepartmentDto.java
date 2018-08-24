package com.carddex.sims2.ws.service.model;

public class DepartmentDto {

	private String code;
	private String name;
	private String chief;
	private String parent;
	private String parentCode;
	
	//
	public DepartmentDto(String code, String name, String chief, String parent, String parentCode) {
		super();
		this.code = code;
		this.name = name;
		this.chief = chief;
		this.parent = parent;
		this.parentCode = parentCode;
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

	public String getChief() {
		return chief;
	}

	public void setChief(String chief) {
		this.chief = chief;
	}

	public String getParent() {
		return parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public String getParentCode() {
		return parentCode;
	}

	public void setParentCode(String parentCode) {
		this.parentCode = parentCode;
	}
	
	public int hash() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((code == null) ? 0 : code.hashCode());
		result = prime * result + ((chief == null) ? 0 : chief.hashCode());
		return result;
	}

	@Override
    public String toString() {
    	return "код= " + code + "; название= " + name + "; начальник= " + chief;
    }


}
