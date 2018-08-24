package com.carddex.sims2.ws.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import javax.persistence.PersistenceException;

import org.hibernate.JDBCException;
import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.IncorrectResultSizeDataAccessException;

import com.carddex.sims2.model.Department;
import com.carddex.sims2.security.repository.DepartmentRepository;
import com.carddex.sims2.ws.service.model.DepartmentDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

public class DepartmentSynchronizationServiceImpl extends SynchronizationServiceImpl implements SinchronizationService {

	private static final Logger log = LoggerFactory.getLogger(DepartmentSynchronizationServiceImpl.class);

	private static final String RETRIVE_ALL_DEPARTMENT = "ВЫБРАТЬ	СП.Код,	СП.Наименование, СП.ТекущийРуководитель, СП.Родитель.Наименование КАК Родитель, СП.Родитель.Код ИЗ Справочник.СтруктураПредприятия КАК СП ГДЕ СП.ПометкаУдаления = ЛОЖЬ";

	@Autowired
	private DepartmentRepository departmentRepository;

	//
	public DepartmentSynchronizationServiceImpl(String defaultUri, String username, String password) {
		super(defaultUri, username, password);
	}

	//
	
	public void update() {
		
		log.info("Обновление структуры организации - СТАРТ.");

		List<Department> list = departmentRepository.findAll();

		String result = port.executeQuery(RETRIVE_ALL_DEPARTMENT);
		//String result = readJson("d:\\workspaces\\carddex-workspace\\sims-2-0\\departments.json");// Отладка
		List<DepartmentDto> dtoList;
		try {
			dtoList = mapToDepartment(result, true);
			matchNomenclature(dtoList, true, list);
			list.stream().forEach(i -> log.info("----> Запись будет удалена. Код = " + i.toString()));
			departmentRepository.deleteAll(list);
		} catch (IOException ioex) {
			log.error("Ошибка парсинга структуры организации." + System.getProperty("line.separator")
					+ ioex.getLocalizedMessage());
		} catch (JDBCException e) {
			log.error("----> Ошибка синхронизации структуры организации. " + e.getLocalizedMessage());
		}catch (DataIntegrityViolationException e) {
			log.error("----> Ошибка синхронизации структуры организации. " + e.getLocalizedMessage());
		}
		log.info("Обновление структуры организации - СТОП.");

	}

	private String readJson(String path) {

		byte[] encoded;
		try {
			encoded = Files.readAllBytes(Paths.get(path));
			return new String(encoded);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

	private void matchNomenclature(List<DepartmentDto> items, boolean isGroup, List<Department> list)
			throws IncorrectResultSizeDataAccessException, PersistenceException {
		/*
		 * Всего 2 прохода. В первом проходе добавляем/модифицируем Во 2-м проходе
		 * устанавливаем зависимости parent/chaild
		 */
		// 1-й проход.
		for (DepartmentDto item : items) {

			Department department = departmentRepository.findByCode(item.getCode());
			if (department == null) {
				department = departmentRepository.save(new Department(item.getCode(), item.getName(), item.getChief()));
				log.info("---->  Добавена запись. " + item.toString());
			} else if (department.hash() != item.hash()) {
				department.setName(item.getName());
				department.setChief(item.getChief());
				Department modifedItem = departmentRepository.save(department);
				log.info("----> Изменена запись. " + modifedItem.toString());
			}
			list.removeIf(n -> {
				return n.getCode1C().equals(item.getCode());
			});
		}
		// 2-й проход
		for (DepartmentDto item : items) {
			Department department = departmentRepository.findByCode(item.getCode());
			if (department != null) {
				Department parent = departmentRepository.findByCode(item.getParentCode());
				if (parent != null) {
					// проверяем, сменился ли родитель.
					if (department.getParent() == null && item.getParentCode().length() > 0) {
						department.setParent(parent);
						department = departmentRepository.save(department);
						log.info("----> Изменена запись. Код = " + department.toString());
					} else if (department.getParent() != null && department.getParent().hash() != parent.hash()) {
						department.setParent(parent);
						department = departmentRepository.save(department);
						log.info("----> Изменена запись. Код = " + department.toString());
					}
				}
			}
		}
	}

	private List<DepartmentDto> mapToDepartment(String result, Boolean isGroup) throws IOException {
		
		ObjectMapper mapper = new ObjectMapper();
		SimpleModule module = new SimpleModule();
		DepartmentDeserializer des = new DepartmentDeserializer();
		module.addDeserializer(DepartmentDto.class, des);
		mapper.registerModule(module);
		List<DepartmentDto> dtos = mapper.readValue(result, new TypeReference<List<DepartmentDto>>(){});

		return dtos;
	}

}
