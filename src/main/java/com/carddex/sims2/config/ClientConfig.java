package com.carddex.sims2.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.carddex.sims2.ws.service.DepartmentSynchronizationServiceImpl;
import com.carddex.sims2.ws.service.EmployeeSynchronizationServiceImpl;
import com.carddex.sims2.ws.service.NomenclatureSynchronizationServiceImpl;
import com.carddex.sims2.ws.service.StaffSynchronizationServiceImpl;
import com.carddex.sims2.ws.service.SynchronizationServiceImpl;


@Configuration
@ConfigurationProperties(prefix = "config")
public class ClientConfig {

	@Value("${ws.default-uri}")
	private String defaultUri;
	@Value("${ws.username}")
	private String username;
	@Value("${ws.password}")
	private String password;


	//@Bean(name="nomenclatureSynchronizationService")
	@Bean(name="synchronizationService")
	public SynchronizationServiceImpl synchronizationService() {
		return new SynchronizationServiceImpl(defaultUri,username, password);
	}

	@Bean(name="nomenclatureSynchronizationService")
	public NomenclatureSynchronizationServiceImpl nomenclatureSynchronizationService() {
		return new NomenclatureSynchronizationServiceImpl(defaultUri,username, password);
	}

	@Bean(name="departmentSynchronizationService")
	public DepartmentSynchronizationServiceImpl departmentSynchronizationService() {
		return new DepartmentSynchronizationServiceImpl(defaultUri,username, password);
	}

	@Bean(name="staffSynchronizationService")
	public StaffSynchronizationServiceImpl staffSynchronizationService() {
		return new StaffSynchronizationServiceImpl(defaultUri,username, password);
	}

	@Bean(name="employeeSynchronizationService")
	public EmployeeSynchronizationServiceImpl employeeSynchronizationService() {
		return new EmployeeSynchronizationServiceImpl(defaultUri,username, password);
	}
}