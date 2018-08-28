package com.carddex.sims2.ws.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;

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

	protected String readJson(String path) {

		byte[] encoded;
		try {
			encoded = Files.readAllBytes(Paths.get(path));
			return new String(encoded);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
}
