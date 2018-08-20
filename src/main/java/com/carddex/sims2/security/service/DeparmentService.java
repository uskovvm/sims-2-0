package com.carddex.sims2.security.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.carddex.sims2.model.Department;
import com.carddex.sims2.model.Organization;
import com.carddex.sims2.rest.dto.DepartmentDto;
import com.carddex.sims2.rest.dto.DepartmentsResp;
import com.carddex.sims2.security.repository.DepartmentRepository;

@Service
public class DeparmentService {

	@Autowired
	private DepartmentRepository departmentRepository;

	public DepartmentsResp loadAlldepartments() {
		List<Department> departments = departmentRepository.findAll();
		List<DepartmentDto> result = mapDepartmentsToDto(departments);

		return new DepartmentsResp(result);
	}

	private List<DepartmentDto> mapDepartmentsToDto(List<Department> departments) {
		List<DepartmentDto> result = new ArrayList<DepartmentDto>();
		for (Department department : departments) {
			Long orgId = null;
			for (Organization org : department.getOrganizations()) {
				orgId = org.getId();
			}
			if (orgId != null)//скрытый - не добавляем
				result.add(new DepartmentDto(department.getId(), department.getName(), department.getDescription(),
						orgId, department.getId1C(), department.getOrganizationId1C(),
						department.getDayScheduleTypeId(), department.getBlocked()));
		}
		return result;
	}
}
