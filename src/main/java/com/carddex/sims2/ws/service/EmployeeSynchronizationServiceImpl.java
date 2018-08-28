package com.carddex.sims2.ws.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import javax.persistence.PersistenceException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;

import com.carddex.sims2.model.Department;
import com.carddex.sims2.model.Employee;
import com.carddex.sims2.security.repository.DepartmentRepository;
import com.carddex.sims2.security.repository.EmployeeRepository;
import com.carddex.sims2.ws.service.model.EmployeeDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

public class EmployeeSynchronizationServiceImpl extends SynchronizationServiceImpl implements SinchronizationService {

	private static final Logger log = LoggerFactory.getLogger(EmployeeSynchronizationServiceImpl.class);
	// @formatter:off
	private static final String RETRIVE_ALL_EMPLOYERS = "ВЫБРАТЬ КИС.Сотрудник.Код, КИС.ФизическоеЛицо.СтраховойНомерПФР КАК ТабельныйНомер,"
			+ " КИС.Должность.Наименование КАК Наименование_связанной_Должности, ФИО_ФЛ.Фамилия, ФИО_ФЛ.Имя, ФИО_ФЛ.Отчество, КИС.Период КАК Дата_приема,"
			+ " ВЫБОР КОГДА КИС.ВидСобытия = ЗНАЧЕНИЕ(Перечисление.ВидыКадровыхСобытий.Увольнение) ТОГДА ИСТИНА ИНАЧЕ ЛОЖЬ КОНЕЦ КАК Признак_Уволен,"
			+ " КИС.Сотрудник.ПометкаУдаления КАК Признак_Удален, КИС.Организация.Наименование КАК Наименование_Организации, КИС.Организация.Код КАК Код_Организации,"
			+ " КИ.НомерТелефона КАК Телефон, КИ.АдресЭП КАК Email ИЗ РегистрСведений.КадроваяИсторияСотрудников.СрезПоследних КАК КИС"
			+ " ЛЕВОЕ СОЕДИНЕНИЕ РегистрСведений.ФИОФизическихЛиц.СрезПоследних КАК ФИО_ФЛ ПО КИС.ФизическоеЛицо = ФИО_ФЛ.ФизическоеЛицо"
			+ " ЛЕВОЕ СОЕДИНЕНИЕ (ВЫБРАТЬ ФЛ_КИ.Ссылка КАК Ссылка, МАКСИМУМ(ФЛ_КИ.НомерТелефона) КАК НомерТелефона,"
			+ " МАКСИМУМ(ФЛ_КИ.АдресЭП) КАК АдресЭП ИЗ Справочник.ФизическиеЛица.КонтактнаяИнформация КАК ФЛ_КИ СГРУППИРОВАТЬ ПО ФЛ_КИ.Ссылка)"
			+ " КАК КИ ПО КИС.ФизическоеЛицо = КИ.Ссылка";
	// @formatter:on
	@Autowired
	private EmployeeRepository employeeRepository;
	@Autowired
	private DepartmentRepository departmentRepository;

	//
	public EmployeeSynchronizationServiceImpl(String defaultUri, String username, String password) {
		super(defaultUri, username, password);
	}

	//
	public void update() {

		log.info("Обновление информации о сотрудниках - СТАРТ.");

		List<Employee> list = employeeRepository.findAll();
		// String result = port.executeQuery(RETRIVE_ALL_EMPLOYERS);
		String result = readJson("d:\\workspaces\\carddex-workspace\\sims-2-0\\employee.json");// Отладка
		List<EmployeeDto> items = mapToEmployee(result);
		synchronize(items, list);
		employeeRepository.deleteAll(list);
		list.stream().forEach(i -> log.info("----> Запись будет удалена. " + i.toString()));

		log.info("Обновление информации о сотрудниках - СТОП.");
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

	private List<EmployeeDto> mapToEmployee(String result) {
		ObjectMapper mapper = new ObjectMapper();
		SimpleModule module = new SimpleModule();
		EmployeeDeserializer des = new EmployeeDeserializer();
		module.addDeserializer(EmployeeDto.class, des);
		mapper.registerModule(module);

		try {
			List<EmployeeDto> list = mapper.readValue(result, new TypeReference<List<EmployeeDto>>() {
			});
			return list;
		} catch (IOException e) {
			log.error("Ошибка парсинга списка сотруников." + System.getProperty("line.separator")
					+ e.getLocalizedMessage());
			System.err.println(e.getMessage());
		}
		return null;
	}

	private void synchronize(List<EmployeeDto> items, List<Employee> list) {
		for (EmployeeDto item : items) {
			try {
				List<Employee> employees = employeeRepository.findByCode1C(item.getCode());
				if (employees.size() > 1) {
					throw new IncorrectResultSizeDataAccessException(employees.size());
				} else if (employees.size() == 0) {
					Employee employee = new Employee();
					update(employee,item);
					employeeRepository.save(employee);
					log.info("---->  Добавена запись. " + item.toString());
				} else {
					Employee employee = employees.stream().findFirst().get();
					if (employee != null && employee.hash() != item.hash()) {
						update(employee,item);
						Employee modifedItem = employeeRepository.save(employee);
						log.info("----> Изменена запись. " + modifedItem.toString());
					}
				}

				list.removeIf(n -> {
					return n.getCode1C().equals(item.getCode());
				});
			} catch (IncorrectResultSizeDataAccessException | PersistenceException e) {
				log.error("Ошибка обновения списка сотрудников." + System.getProperty("line.separator")
						+ e.getLocalizedMessage());
			}
		}
	}

	private void update(Employee employee, EmployeeDto item) {
		employee.setFirstName(item.getFirstName());
		employee.setMiddleName(item.getMiddleName());
		employee.setLastName(item.getLastName());
		employee.setStartDate(item.getStartDate());
		employee.setCode1C(item.getCode());
		employee.setTabNumber(item.getTabNumber());
		employee.setPosition(item.getPosition());
		employee.setIsFired(item.getIsFired());
		employee.setIsDeleted(item.getIsDeleted());
		employee.setPhone(item.getPhone());
		employee.setEmail(item.getEmail());
		Department department = departmentRepository.findByCode(item.getOrganizationCode());
		if(department != null)
			employee.setDepartment(department);
	}
}
