package com.carddex.sims2.ws.service;

import java.io.IOException;
import java.util.List;
import java.util.Set;

import javax.persistence.PersistenceException;

import org.hibernate.JDBCException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.IncorrectResultSizeDataAccessException;

import com.carddex.sims2.model.Staff;
import com.carddex.sims2.security.repository.StaffRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

public class StaffSynchronizationServiceImpl extends SynchronizationServiceImpl implements SinchronizationService {

	private static final Logger log = LoggerFactory.getLogger(StaffSynchronizationServiceImpl.class);

	private static final String RETRIVE_STAFF_LIST = "ВЫБРАТЬ ШР.Должность.Наименование КАК Наименование, ШР.Подразделение.Код КАК Код_связанного_Подразделения,"
			+ " ШР.Подразделение.Наименование КАК Наименование_связанного_Подразделения ИЗ Справочник.ШтатноеРасписание КАК ШР ГДЕ ШР.Утверждена = ИСТИНА"
			+ " И ШР.Закрыта = ЛОЖЬ И ШР.ПометкаУдаления = ЛОЖЬ";

	@Autowired
	private StaffRepository staffRepository;

	//
	public StaffSynchronizationServiceImpl(String defaultUri, String username, String password) {
		super(defaultUri, username, password);
	}

	//
	public void update() {

		log.info("Обновление справочника должностей - СТАРТ.");

		List<Staff> list = staffRepository.findAll();

		String result = port.executeQuery(RETRIVE_STAFF_LIST);
		//String result = readJson("d:\\workspaces\\carddex-workspace\\sims-2-0\\staff_list.json");// Отладка

		Set<Staff> dtoList;
		try {
			dtoList = mapToStaff(result);
			synchronize(dtoList, list);
			list.stream().forEach(i -> log.info("----> Запись будет удалена. " + i.toString()));
			staffRepository.deleteAll(list);
		} catch (IOException ioex) {
			log.error("Ошибка парсинга справочника должностей." + System.getProperty("line.separator")
					+ ioex.getLocalizedMessage());
		} catch (JDBCException e) {
			log.error("----> Ошибка синхронизации справочника должностей. " + e.getLocalizedMessage());
		} catch (DataIntegrityViolationException e) {
			log.error("----> Ошибка синхронизации справочника должностей. " + e.getLocalizedMessage());
		}
		log.info("Обновление справочника должностей - СТОП.");

	}

	private void synchronize(Set<Staff> items, List<Staff> list)
			throws IncorrectResultSizeDataAccessException, PersistenceException {
		for (Staff item : items) {
			try {
				Staff staff = staffRepository.findByName(item.getName());
				if (staff == null) {
					staffRepository.save(item);
					log.info("---->  Добавена запись. " + item.toString());
				} else if (staff.hashCode() != item.hashCode()) {
					staff.setName(item.getName());
					Staff saved = staffRepository.save(staff);
					log.info("----> Изменена запись. " + saved.toString());
				}
				list.removeIf(n -> {
					return n.hashCode() == item.hashCode();
				});
			} catch (IncorrectResultSizeDataAccessException | PersistenceException e) {
				log.error("Ошибка обновения справочника должностей." + System.getProperty("line.separator")
						+ e.getLocalizedMessage());
			}
		}
	}

	private Set<Staff> mapToStaff(String result) throws IOException {

		ObjectMapper mapper = new ObjectMapper();
		SimpleModule module = new SimpleModule();
		StaffDeserializer des = new StaffDeserializer();
		module.addDeserializer(Staff.class, des);
		mapper.registerModule(module);

		return mapper.readValue(result, new TypeReference<Set<Staff>>() {});
	}
}
