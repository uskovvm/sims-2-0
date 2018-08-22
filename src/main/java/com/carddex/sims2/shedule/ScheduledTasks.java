package com.carddex.sims2.shedule;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.carddex.sims2.ws.service.WsService;


@Component
public class ScheduledTasks {

	private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

	private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
	
	@Autowired
	private WsService service;

	@Scheduled(cron = "${rates.refresh.cron}")
	public void reportCurrentTime() {
		log.info("Обновление номенклатуры - старт {}", dateFormat.format(new Date()));
		service.updateNomenclature();
		log.info("Обновление номенклатуры - стоп {}", dateFormat.format(new Date()));
	}
}