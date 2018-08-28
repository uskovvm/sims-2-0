package com.carddex.sims2.ws.service;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.carddex.sims2.utils.SimsUtils;
import com.carddex.sims2.ws.service.model.EmployeeDto;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

public class EmployeeDeserializer extends StdDeserializer<EmployeeDto> {
	private static final Logger log = LoggerFactory.getLogger(EmployeeDeserializer.class);

	public EmployeeDeserializer() {
		this(null);
	}

	public EmployeeDeserializer(Class<?> vc) {
		super(vc);
	}

	@Override
	public EmployeeDto deserialize(JsonParser jp, DeserializationContext ctxt) {
		JsonNode node;
		String lastName = "";
		String firstName = "";
		String middleName = "";

		try {
			node = jp.getCodec().readTree(jp);
			firstName = node.get("Имя").asText();
			middleName = node.get("Отчество").asText();
			lastName = node.get("Фамилия").asText();
			Date startDate = SimsUtils.dateFromString(node.get("Дата_приема").asText());
			String code = node.get("СотрудникКод").asText();
			String tabNumber = node.get("ТабельныйНомер").asText();
			String position = node.get("Наименование_связанной_Должности").asText();
			Boolean isFired = SimsUtils.getBooleanFromString(node.get("Признак_Уволен").asText());
			Boolean isDeleted = SimsUtils.getBooleanFromString(node.get("Признак_Удален").asText());
			String organizationCode = node.get("Код_Организации").asText();
			String organizationName = node.get("Наименование_Организации").asText();
			String phone = node.get("Телефон").asText();
			String email = node.get("Email").asText();

			return new EmployeeDto(firstName, middleName, lastName, startDate, code, tabNumber, position, isFired,
					isDeleted, organizationCode, organizationName, phone, email);
		} catch (Exception e) {
			log.error("Ошибка парсига списка сотрудников. " + lastName + " " + firstName + " " + " " + middleName);
			log.error(e.getMessage());
			return null;
		}
	}
}
