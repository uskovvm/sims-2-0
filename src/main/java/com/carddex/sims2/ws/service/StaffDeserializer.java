package com.carddex.sims2.ws.service;

import java.io.IOException;

import com.carddex.sims2.model.Staff;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

public class StaffDeserializer extends StdDeserializer<Staff> {


	public StaffDeserializer() {
		this(null);
	}

	public StaffDeserializer(Class<?> vc) {
		super(vc);
	}

	@Override
	public Staff deserialize(JsonParser jp, DeserializationContext ctxt)
			throws IOException, JsonProcessingException {
		JsonNode node = jp.getCodec().readTree(jp);
		String name = node.get("Наименование").asText();
		String departmentCode = node.get("Код_связанного_Подразделения").asText();
		String departmentName = node.get("Наименование_связанного_Подразделения").asText();

		return new Staff(name, departmentCode);
	}
}
