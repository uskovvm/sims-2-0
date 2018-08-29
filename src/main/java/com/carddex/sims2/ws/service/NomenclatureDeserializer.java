package com.carddex.sims2.ws.service;

import java.io.IOException;

import com.carddex.sims2.ws.service.model.NomenclatureDto;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

public class NomenclatureDeserializer extends StdDeserializer<NomenclatureDto> {

	private Boolean isGroup = false;

	public NomenclatureDeserializer() {
		this(null);
	}

	public NomenclatureDeserializer(Class<?> vc) {
		super(vc);
	}

	@Override
	public NomenclatureDto deserialize(JsonParser jp, DeserializationContext ctxt)
			throws IOException, JsonProcessingException {
		JsonNode node = jp.getCodec().readTree(jp);
		String code = node.get("Код").asText();
		String name = node.get("Наименование").asText();
		String shortName = "";
		String parentName = "";
		String parentCode = "";
		if(!isGroup) {
			shortName = node.get("НаименованиеКраткое").asText();
			parentName = node.get("Родитель").asText();
			parentCode = node.get("РодительКод").asText();
		}
		return new NomenclatureDto(code, name, shortName, parentName, parentCode, isGroup);
	}

	public void setIsGroup(Boolean isGroup) {
		this.isGroup = isGroup;
	}

}
