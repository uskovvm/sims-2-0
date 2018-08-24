package com.carddex.sims2.rest.dto;


public class DepartmentDto {

	private Long id;

    private String name;

    private String description;
    
    private Integer dayScheduleTypeId;
    
    private Boolean blocked;
    
    private Long organizationId;

    private String id1C;
	
    private Integer organizationId1C;
    

	public DepartmentDto(Long id, String name, String description, Long organizationId, String id1C,
			Integer organizationId1C, Integer dayScheduleTypeId, Boolean blocked) {

		this.id=id;
		this.name=name;
		this.description=description;
		this.dayScheduleTypeId=dayScheduleTypeId;
		this.blocked=blocked;
		this.organizationId=organizationId;
		this.id1C=id1C;
		this.organizationId1C=organizationId1C;

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

	public Long getOrganizationId() {
		return organizationId;
	}

	public void setOrganizationId(Long organizationId) {
		this.organizationId = organizationId;
	}

	public String getId1C() {
		return id1C;
	}

	public void setId1C(String id1c) {
		id1C = id1c;
	}

	public Integer getOrganizationId1C() {
		return organizationId1C;
	}

	public void setOrganizationId1C(Integer organizationId1C) {
		this.organizationId1C = organizationId1C;
	}

}
