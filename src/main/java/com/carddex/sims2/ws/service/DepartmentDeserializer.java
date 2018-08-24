package com.carddex.sims2.ws.service;

import java.io.IOException;

import com.carddex.sims2.ws.service.model.DepartmentDto;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

public class DepartmentDeserializer extends StdDeserializer<DepartmentDto> {


	public DepartmentDeserializer() {
		this(null);
	}

	public DepartmentDeserializer(Class<?> vc) {
		super(vc);
	}

	@Override
	public DepartmentDto deserialize(JsonParser jp, DeserializationContext ctxt)
			throws IOException, JsonProcessingException {
		JsonNode node = jp.getCodec().readTree(jp);
		String code = node.get("Код").asText();
		String name = node.get("Наименование").asText();
		String chief = node.get("ТекущийРуководитель").asText();
		String parent = node.get("Родитель").asText();
		String parentCode = node.get("РодительКод").asText();

		return new DepartmentDto(code, name, chief, parent, parentCode);
	}
}
