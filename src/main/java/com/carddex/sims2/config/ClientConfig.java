package com.carddex.sims2.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.carddex.sims2.ws.service.WsService;


@Configuration
@ConfigurationProperties(prefix = "config")
public class ClientConfig {

	@Value("${ws.default-uri}")
	private String defaultUri;
	@Value("${ws.username}")
	String username;
	@Value("${ws.password}")
	String password;


	@Bean
	public WsService webService() {
		return new WsService(defaultUri,username, password);
	}

}