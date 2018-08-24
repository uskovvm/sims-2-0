package com.carddex.sims2.shedule;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.carddex.sims2.ws.service.SinchronizationService;


@Component
public class ScheduledTasks {

	private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

	@Autowired
	@Qualifier("nomenclatureSynchronizationService")
	private SinchronizationService nomenclatureSynchronizationService;
	@Autowired
	@Qualifier("departmentSynchronizationService")
	private SinchronizationService departmentSynchronizationService;

	
	@Scheduled(cron = "${nomenclature.synch.shedule}")
	public void reportCurrentTime() {
		
		log.info("Обновление номенклатуры - СТАРТ.");
		
		//nomenclatureSynchronizationService.update();
		departmentSynchronizationService.update();
		
		log.info("Обновление номенклатуры - СТОП.");
	}
}