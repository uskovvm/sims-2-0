package com.carddex.sims2.ws.service;

import java.io.IOException;
import java.util.List;

import javax.persistence.PersistenceException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;

import com.carddex.sims2.model.Nomenclature;
import com.carddex.sims2.security.repository.NomenclatureRepository;
import com.carddex.sims2.ws.service.model.NomenclatureDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

public class NomenclatureSynchronizationServiceImpl extends SynchronizationServiceImpl
		implements SinchronizationService {

	private static final Logger log = LoggerFactory.getLogger(NomenclatureSynchronizationServiceImpl.class);

	private static final String RETRIVE_ALL_NOMENCLATURE_GROUPS = "ВЫБРАТЬ Н.Код, Н.Наименование ИЗ Справочник.Номенклатура КАК Н ГДЕ Н.ПометкаУдаления = ЛОЖЬ И Н.ЭтоГруппа = ИСТИНА";
	private static final String RETRIVE_ALL_NOMENCLATURE_ITEMS = "ВЫБРАТЬ Н.Код, Н.НаименованиеПолное КАК Наименование, Н.Наименование КАК НаименованиеКраткое, Н.Родитель.Наименование КАК Родитель, Н.Родитель.Код ИЗ Справочник.Номенклатура КАК Н ГДЕ Н.ПометкаУдаления = ЛОЖЬ И Н.ЭтоГруппа = ЛОЖЬ";

	@Autowired
	private NomenclatureRepository nomenclatureRepository;

	//
	public NomenclatureSynchronizationServiceImpl(String defaultUri, String username, String password) {
		super(defaultUri, username, password);
	}

	//
	public void update() {

		log.info("Обновление номенклатуры - СТАРТ.");
		List<Nomenclature> list = nomenclatureRepository.findAll();
		//String result = port.executeQuery(RETRIVE_ALL_NOMENCLATURE_GROUPS);
		String result = readJson("d:\\workspaces\\carddex-workspace\\sims-2-0\\groups.json");//Отладка
		List<NomenclatureDto> groups = mapToNomenclature(result, true);
		//result = port.executeQuery(RETRIVE_ALL_NOMENCLATURE_ITEMS);
		result = readJson("d:\\workspaces\\carddex-workspace\\sims-2-0\\items.json");//Отладка
		List<NomenclatureDto> items = mapToNomenclature(result, false);
		items.addAll(groups);
		
		synchronize(items, list);
		nomenclatureRepository.deleteAll(list);
		list.stream().forEach(i -> log.info("---->  Запись будет удалена. " + i.toString()));

		log.info("Обновление номенклатуры - СТОП.");
	}

	private void synchronize(List<NomenclatureDto> items, List<Nomenclature> list)
			throws IncorrectResultSizeDataAccessException, PersistenceException {
		/*
		 * Всего 2 прохода. В первом проходе добавляем/модифицируем Во 2-м проходе
		 * устанавливаем зависимости parent/chaild
		 */
		// 1-й проход.
		for (NomenclatureDto item : items) {

			Nomenclature nomenclature = nomenclatureRepository.findByCode(item.getCode());
			if (nomenclature == null) {
				nomenclature = nomenclatureRepository.save(new Nomenclature(item.getCode(), item.getName(), item.getShortName()));
				log.info("---->  Добавена запись. " + nomenclature.toString());
			} else if (nomenclature.hash() != item.hashCode()) {
				nomenclature.setName(item.getName());
				nomenclature.setShortName(item.getShortName());
				nomenclature = nomenclatureRepository.save(nomenclature);
				log.info("----> Изменена запись. " + nomenclature.toString());
			}
			list.removeIf(n -> {
				return n.getCode().equals(item.getCode());
			});
		}
		// 2-й проход
		for (NomenclatureDto item : items) {
			Nomenclature nomenclature = nomenclatureRepository.findByCode(item.getCode());
			if (nomenclature != null) {
				Nomenclature group = nomenclatureRepository.findByCode(item.getParentCode());
				if (group != null) {
					// проверяем, сменился ли родитель.
					if (nomenclature.getGroup() == null && item.getParentCode().length() > 0) {
						nomenclature.setGroup(group);
						nomenclature = nomenclatureRepository.save(nomenclature);
						log.info("----> Изменена запись. " + nomenclature.toString());
					} else if (nomenclature.getGroup() != null && nomenclature.getGroup().hash() != group.hash()) {
						nomenclature.setGroup(group);
						nomenclature = nomenclatureRepository.save(nomenclature);
						log.info("----> Изменена запись. " + nomenclature.toString());
					}
				}
			}
		}
	}

	
	private List<NomenclatureDto> mapToNomenclature(String result, Boolean isGroup) {
		ObjectMapper mapper = new ObjectMapper();
		SimpleModule module = new SimpleModule();
		
		NomenclatureDeserializer des = new NomenclatureDeserializer();
		des.setIsGroup(isGroup);
		
		module.addDeserializer(NomenclatureDto.class, des);
		mapper.registerModule(module);

		List<NomenclatureDto> nomenclatures;
		try {
			nomenclatures = mapper.readValue(result, new TypeReference<List<NomenclatureDto>>() {
			});
			return nomenclatures;
		} catch (IOException e) {
			log.error("Ошибка парсинга номенклатуры." + System.getProperty("line.separator") + e.getLocalizedMessage());
		}
		return null;
	}
}
