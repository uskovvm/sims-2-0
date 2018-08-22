package com.carddex.sims2.ws.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;

import com.carddex.sims2.model.NomenclatureGroup;
import com.carddex.sims2.model.NomenclatureItem;
import com.carddex.sims2.security.repository.NomenclatureGroupRepository;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

public class NomenclatureItemDeserializer extends StdDeserializer<NomenclatureItem> {

	private NomenclatureGroupRepository nomenclatureGroupRepository;

	public NomenclatureItemDeserializer() {
		this(null);
	}

	public NomenclatureItemDeserializer(Class<?> vc) {
		super(vc);
	}

	@Override
	public NomenclatureItem deserialize(JsonParser jp, DeserializationContext ctxt)
			throws IOException, JsonProcessingException {
		JsonNode node = jp.getCodec().readTree(jp);
		String code = node.get("Код").asText();
		String name = node.get("Наименование").asText();
		String shortName = node.get("НаименованиеКраткое").asText();
		String parentName = node.get("Родитель").asText();
		String parentCode = node.get("РодительКод").asText();
		
		if (parentName.length() == 0 || parentCode.length() == 0) {
			System.out.println("code = " + code);
			System.out.println("name = " + name);
			System.out.println("parent name = " + parentName);
			System.out.println("parent code = " + parentCode);
		}

		NomenclatureGroup group = nomenclatureGroupRepository.findByCode(parentCode);

		return new NomenclatureItem(code, name, shortName, parentName, parentCode, group);
	}

	public NomenclatureGroupRepository getNomenclatureGroupRepository() {
		return nomenclatureGroupRepository;
	}

	public void setNomenclatureGroupRepository(NomenclatureGroupRepository nomenclatureGroupRepository) {
		this.nomenclatureGroupRepository = nomenclatureGroupRepository;
	}

}
