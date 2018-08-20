package com.carddex.sims2.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.carddex.sims2.security.service.WsService;


@Configuration
public class ClientConfig {

	@Value("${client.default-uri}")
	private String defaultUri;


	@Bean
	public WsService webService() {
		return new WsService(defaultUri);
	}

}