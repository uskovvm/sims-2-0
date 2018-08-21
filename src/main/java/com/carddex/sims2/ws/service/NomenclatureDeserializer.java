package com.carddex.sims2.ws.service;

import java.io.IOException;

import com.carddex.sims2.model.Nomenclature;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

public class NomenclatureDeserializer extends StdDeserializer<Nomenclature> {

	public NomenclatureDeserializer() {
		this(null);
	}

	public NomenclatureDeserializer(Class<?> vc) {
		super(vc);
	}

	@Override
	public Nomenclature deserialize(JsonParser jp, DeserializationContext ctxt)
			throws IOException, JsonProcessingException {
		JsonNode node = jp.getCodec().readTree(jp);
		String code = node.get("Код").asText();
		String name = node.get("Наименование").asText();

		return new Nomenclature(code, name);
	}
}
