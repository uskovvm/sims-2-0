package com.carddex.sims2.ws.service;

import java.net.MalformedURLException;
import java.net.URL;

import javax.xml.namespace.QName;
import javax.xml.ws.BindingProvider;
import javax.xml.ws.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.carddex.sims2.ws.CarddexMakePortType;

public class SynchronizationServiceImpl {
	private static final Logger log = LoggerFactory.getLogger(SynchronizationServiceImpl.class);

	private String defaultUri;
	private URL url;
	private QName qname;
	private Service service;
	private BindingProvider bp;
	private String username;
	private String password;

	protected CarddexMakePortType port;

	//
	public SynchronizationServiceImpl(String defaultUri, String username, String password) {
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
			log.error("Ошибка соединения с 1С сервисом." + System.getProperty("line.separator")
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
	 * 
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
