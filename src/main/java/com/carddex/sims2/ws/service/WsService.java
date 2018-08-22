package com.carddex.sims2.ws.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collections;
import java.util.List;

import javax.persistence.PersistenceException;
import javax.xml.namespace.QName;
import javax.xml.ws.BindingProvider;
import javax.xml.ws.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;

import com.carddex.sims2.model.Nomenclature;
import com.carddex.sims2.model.NomenclatureGroup;
import com.carddex.sims2.model.NomenclatureItem;
import com.carddex.sims2.security.repository.NomenclatureGroupRepository;
import com.carddex.sims2.security.repository.NomenclatureItemRepository;
import com.carddex.sims2.security.repository.NomenclatureRepository;
import com.carddex.sims2.shedule.ScheduledTasks;
import com.carddex.sims2.ws.CarddexMakePortType;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

public class WsService {
	private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

	private String defaultUri;
	private URL url;
	private QName qname;
	private Service service;
	private CarddexMakePortType port;
	private BindingProvider bp;
	private String username;
	private String password;

	@Autowired
	private NomenclatureGroupRepository nomenclatureGroupRepository;
	@Autowired
	private NomenclatureItemRepository nomenclatureItemRepository;
	@Autowired
	private NomenclatureRepository nomenclatureRepository;

	public WsService(String defaultUri, String username, String password) {
		this.defaultUri = defaultUri;
		this.username = username;
		this.password = password;
		init();
	}

	private void init() {
		try {
			url = new URL(defaultUri);
			qname = new QName("Carddex_Make", "Carddex_Make");
			service = Service.create(url, qname);
			port = service.getPort(CarddexMakePortType.class);
			bp = (BindingProvider) port;
			bp.getRequestContext().put(BindingProvider.USERNAME_PROPERTY, username);
			bp.getRequestContext().put(BindingProvider.PASSWORD_PROPERTY, password);

		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
	}

	public void update() throws MalformedURLException {

		updateNomenclature();

		// updateNomenclatureGroup();
		// updateNomenclatureItems();
	}

	private void updateNomenclature() {
		List<Nomenclature> list = nomenclatureRepository.findAll();
		List<Nomenclature> synchList = Collections.synchronizedList(list);

		String result = port.executeQuery(
				"ВЫБРАТЬ Н.Код, Н.Наименование ИЗ Справочник.Номенклатура КАК Н ГДЕ Н.ПометкаУдаления = ЛОЖЬ И Н.ЭтоГруппа = ИСТИНА");
		List<Nomenclature> nomenclatures = mapToNomenclature(result, true);
		for (Nomenclature nomenclature : nomenclatures) {
			try {
				Nomenclature nom = nomenclatureRepository.findByCode(nomenclature.getCode());
				if (nom == null)
					nomenclatureRepository.save(nomenclature);
				else {
					if (nom.hashCode() != nomenclature.hashCode()) {
						nom.setName(nomenclature.getName());
						nomenclatureRepository.save(nom);
					}
					synchList.remove(nom);
				}
			} catch (IncorrectResultSizeDataAccessException | PersistenceException e) {
				log.error("Ошибка обновения номенклатуры." + System.getProperty("line.separator")
						+ e.getLocalizedMessage());
			}
		}
		result = port.executeQuery(
				"ВЫБРАТЬ Н.Код, Н.НаименованиеПолное КАК Наименование, Н.Наименование КАК НаименованиеКраткое, Н.Родитель.Наименование КАК Родитель, Н.Родитель.Код ИЗ Справочник.Номенклатура КАК Н ГДЕ Н.ПометкаУдаления = ЛОЖЬ И Н.ЭтоГруппа = ЛОЖЬ");
		nomenclatures.addAll(mapToNomenclature(result, false));
		for (Nomenclature nomenclature : nomenclatures) {
			try {
				Nomenclature nom = nomenclatureRepository.findByCode(nomenclature.getCode());
				if (nom == null)
					nomenclatureRepository.save(nomenclature);
				else {
					if (nom.hashCode() != nomenclature.hashCode()) {

						nom.setName(nomenclature.getName());
						nomenclatureRepository.save(nom);
					}
					synchList.remove(nom);
				}
			} catch (IncorrectResultSizeDataAccessException | PersistenceException e) {
				log.error("Ошибка обновения номенклатуры." + System.getProperty("line.separator")
						+ e.getLocalizedMessage());
			}
		}
		nomenclatureRepository.deleteAll(synchList);

	}

	public void updateNomenclatureGroup() {

		String result = port.executeQuery(
				"ВЫБРАТЬ Н.Код, Н.Наименование ИЗ Справочник.Номенклатура КАК Н ГДЕ Н.ПометкаУдаления = ЛОЖЬ И Н.ЭтоГруппа = ИСТИНА");
		List<NomenclatureGroup> nomenclatures = mapToNomenclatureGroup(result);

		for (NomenclatureGroup nomenclature : nomenclatures) {
			try {
				NomenclatureGroup nom = nomenclatureGroupRepository.findByCode(nomenclature.getCode());
				if (nom == null)
					nomenclatureGroupRepository.save(nomenclature);
				else if (!nom.equals(nomenclature)) {
					nom.setName(nomenclature.getName());
					nomenclatureGroupRepository.save(nom);
				}
			} catch (IncorrectResultSizeDataAccessException | PersistenceException e) {
				log.error("Ошибка обновения номенклатуры." + System.getProperty("line.separator")
						+ e.getLocalizedMessage());
			}
		}
	}

	public void updateNomenclatureItems() throws IncorrectResultSizeDataAccessException {

		String result = port.executeQuery(
				"ВЫБРАТЬ Н.Код, Н.НаименованиеПолное КАК Наименование, Н.Наименование КАК НаименованиеКраткое, Н.Родитель.Наименование КАК Родитель, Н.Родитель.Код ИЗ Справочник.Номенклатура КАК Н ГДЕ Н.ПометкаУдаления = ЛОЖЬ И Н.ЭтоГруппа = ЛОЖЬ");

		System.out.println(result);

		List<NomenclatureItem> wsItems = mapToNomenclatureItem(result);

		for (NomenclatureItem item : wsItems) {
			NomenclatureItem nomenclature;
			try {
				nomenclature = nomenclatureItemRepository.findByCode(item.getCode());
				if (nomenclature == null)
					nomenclatureItemRepository.save(item);
				else {
					if (nomenclature.hashCode() != item.hashCode()) {
						nomenclature.setName(item.getName());
						nomenclature.setShortName(item.getShortName());
						nomenclatureItemRepository.save(nomenclature);
					}
					NomenclatureGroup group = nomenclature.getGroup();
					if (group.hashCode() != item.getGroup().hashCode()) {
						nomenclature.setGroup(item.getGroup());
						nomenclatureItemRepository.save(nomenclature);
					}
				}
			} catch (Exception e) {
				log.error("Ошибка обновения номенклатуры." + System.getProperty("line.separator")
						+ e.getLocalizedMessage());
			}
		}

		/*
		 * System.out.println("2.Выбрать из Подразделений================>");
		 * System.out.
		 * println("2.1Код, Наименование, Краткое Наименование, Прочие важные поля если есть===============>"
		 * );
		 * 
		 * System.out.println(port.executeQuery("ВЫБРАТЬ\n" + "		СП.Код,\n" +
		 * "		СП.Наименование,\n" + "		СП.ТекущийРуководитель,\n" +
		 * "		СП.Родитель.Наименование КАК Родитель,\n" +
		 * "		СП.Родитель.Код\n" + "	ИЗ\n" +
		 * "		Справочник.СтруктураПредприятия КАК СП\n" + "	ГДЕ\n" +
		 * "		СП.ПометкаУдаления = ЛОЖЬ"));
		 * System.out.println("4. Выбрать из должностей===================");
		 * System.out.
		 * println("4.1Код, Код_связанного_Участка или Код_связанного_Подразделения (через что связка идет?), Наименование, Краткое Наименование, Прочие важные поля если есть===============>"
		 * ); System.out.println(port.executeQuery("ВЫБРАТЬ\n" +
		 * "		ШР.Должность.Наименование КАК Наименование,\n" +
		 * "		ШР.Подразделение.Код КАК Код_связанного_Подразделения,\n" +
		 * "		ШР.Подразделение.Наименование КАК Наименование_связанного_Подразделения\n"
		 * + "	ИЗ\n" + "		Справочник.ШтатноеРасписание КАК ШР\n" + "	ГДЕ\n" +
		 * "		ШР.Утверждена = ИСТИНА\n" + "		И ШР.Закрыта = ЛОЖЬ\n" +
		 * "		И ШР.ПометкаУдаления = ЛОЖЬ"));
		 * 
		 * System.out.println("5. Выбрать из должностей===================");
		 * System.out.
		 * println("5.1 Код, Табельный номер, Код_связанной_Должности, Фамилия, Имя, Отчество, Дата приема, Признак_Уволен, Признак_Удален, Телефон, Email, Прочие важные поля если есть===============>"
		 * ); System.out.println(port.executeQuery("ВЫБРАТЬ\n" +
		 * "		КИС.Сотрудник.Код,\n" +
		 * "		КИС.ФизическоеЛицо.СтраховойНомерПФР КАК ТабельныйНомер,\n" +
		 * "		КИС.Должность.Наименование КАК Наименование_связанной_Должности,\n"
		 * + "		ФИО_ФЛ.Фамилия,\n" + "		ФИО_ФЛ.Имя,\n" +
		 * "		ФИО_ФЛ.Отчество,\n" + "		КИС.Период КАК Дата_приема,\n" +
		 * "		ВЫБОР\n" +
		 * "			КОГДА КИС.ВидСобытия = ЗНАЧЕНИЕ(Перечисление.ВидыКадровыхСобытий.Увольнение)\n"
		 * + "				ТОГДА ИСТИНА\n" + "			ИНАЧЕ ЛОЖЬ\n" +
		 * "		КОНЕЦ КАК Признак_Уволен,\n" +
		 * "		КИС.Сотрудник.ПометкаУдаления КАК Признак_Удален,\n" +
		 * "		КИС.Организация.Наименование КАК Наименование_Организации,\n" +
		 * "		КИС.Организация.Код КАК Код_Организации,\n" +
		 * "		КИ.НомерТелефона КАК Телефон,\n" + "		КИ.АдресЭП КАК Email\n"
		 * + "	ИЗ\n" +
		 * "		РегистрСведений.КадроваяИсторияСотрудников.СрезПоследних КАК КИС\n"
		 * +
		 * "			ЛЕВОЕ СОЕДИНЕНИЕ РегистрСведений.ФИОФизическихЛиц.СрезПоследних КАК ФИО_ФЛ\n"
		 * + "			ПО КИС.ФизическоеЛицо = ФИО_ФЛ.ФизическоеЛицо\n" +
		 * "			ЛЕВОЕ СОЕДИНЕНИЕ (ВЫБРАТЬ\n" +
		 * "				ФЛ_КИ.Ссылка КАК Ссылка,\n" +
		 * "				МАКСИМУМ(ФЛ_КИ.НомерТелефона) КАК НомерТелефона,\n" +
		 * "				МАКСИМУМ(ФЛ_КИ.АдресЭП) КАК АдресЭП\n" + "			ИЗ\n" +
		 * "				Справочник.ФизическиеЛица.КонтактнаяИнформация КАК ФЛ_КИ\n"
		 * + "		\n" + "			СГРУППИРОВАТЬ ПО\n" +
		 * "				ФЛ_КИ.Ссылка) КАК КИ\n" +
		 * "			ПО КИС.ФизическоеЛицо = КИ.Ссылка"));
		 */

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
			e.printStackTrace();
		}
		return null;
	}

	private List<NomenclatureGroup> mapToNomenclatureGroup(String result) {
		ObjectMapper mapper = new ObjectMapper();
		SimpleModule module = new SimpleModule();
		module.addDeserializer(NomenclatureGroup.class, new NomenclatureGroupDeserializer());
		mapper.registerModule(module);

		List<NomenclatureGroup> nomenclatures;
		try {
			nomenclatures = mapper.readValue(result, new TypeReference<List<NomenclatureGroup>>() {
			});
			return nomenclatures;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

	private List<NomenclatureItem> mapToNomenclatureItem(String result) {
		ObjectMapper mapper = new ObjectMapper();
		SimpleModule module = new SimpleModule();
		NomenclatureItemDeserializer des = new NomenclatureItemDeserializer();
		des.setNomenclatureGroupRepository(nomenclatureGroupRepository);
		module.addDeserializer(NomenclatureItem.class, des);
		mapper.registerModule(module);

		List<NomenclatureItem> nomenclatures;
		try {
			nomenclatures = mapper.readValue(result, new TypeReference<List<NomenclatureItem>>() {
			});
			return nomenclatures;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

}
