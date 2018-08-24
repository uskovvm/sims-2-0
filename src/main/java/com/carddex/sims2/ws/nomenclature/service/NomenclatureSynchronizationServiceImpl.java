package com.carddex.sims2.ws.nomenclature.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import javax.persistence.PersistenceException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;

import com.carddex.sims2.model.Nomenclature;
import com.carddex.sims2.security.repository.NomenclatureRepository;
import com.carddex.sims2.ws.service.SinchronizationService;
import com.carddex.sims2.ws.service.SynchronizationServiceImpl;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;


public class NomenclatureSynchronizationServiceImpl extends SynchronizationServiceImpl implements SinchronizationService {
	
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
		List<Nomenclature> list = nomenclatureRepository.findAll();

		String result = port.executeQuery(RETRIVE_ALL_NOMENCLATURE_GROUPS);
		// result =
		// readJson("d:\\workspaces\\carddex-workspace\\sims-2-0\\groups.json");//
		// Отладка
		List<Nomenclature> groups = mapToNomenclature(result, true);
		matchNomenclature(groups, true, list);

		result = port.executeQuery(RETRIVE_ALL_NOMENCLATURE_ITEMS);
		// result =
		// readJson("d:\\workspaces\\carddex-workspace\\sims-2-0\\items.json");//
		// Отладка
		List<Nomenclature> items = mapToNomenclature(result, false);
		matchNomenclature(items, false, list);

		nomenclatureRepository.deleteAll(list);
		list.stream().forEach(i -> log.info("---->  Запись будет удалена. Код = " + i.getCode()));
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

	private void matchNomenclature(List<Nomenclature> items, boolean isGroup, List<Nomenclature> list) {
		for (Nomenclature item : items) {
			try {
				Nomenclature nomenclature = nomenclatureRepository.findByCode(item.getCode());
				if (nomenclature == null) {
					nomenclatureRepository.save(item);
					log.info("---->  Добавена запись. Код = " + item.getCode());
				} else if (nomenclature.hashCode() != item.hashCode()) {
					nomenclature.setName(item.getName());
					if (isGroup) {
						nomenclature.setShortName("");
						nomenclature.setParentName("");
						nomenclature.setParentCode("");
					} else {
						nomenclature.setShortName(item.getShortName());
						nomenclature.setParentName(item.getParentName());
						nomenclature.setParentCode(item.getParentCode());
					}
					Nomenclature modifedItem = nomenclatureRepository.save(nomenclature);
					log.info("----> Изменена запись. Код = " + modifedItem.getCode());
				}
				list.removeIf(n -> {
					return n.getCode().equals(item.getCode());
				});
			} catch (IncorrectResultSizeDataAccessException | PersistenceException e) {
				log.error("Ошибка обновения номенклатуры." + System.getProperty("line.separator")
						+ e.getLocalizedMessage());
			}
		}
	}

	private List<Nomenclature> mapToNomenclature(String result, Boolean isGroup) {
		ObjectMapper mapper = new ObjectMapper();
		SimpleModule module = new SimpleModule();
		NomenclatureDeserializer des = new NomenclatureDeserializer();
		des.setIsGroup(isGroup);
		module.addDeserializer(Nomenclature.class, des);
		mapper.registerModule(module);

		List<Nomenclature> nomenclatures;
		try {
			nomenclatures = mapper.readValue(result, new TypeReference<List<Nomenclature>>() {
			});
			return nomenclatures;
		} catch (IOException e) {
			log.error("Ошибка парсинга номенклатуры." + System.getProperty("line.separator") + e.getLocalizedMessage());
		}
		return null;
	}
}
