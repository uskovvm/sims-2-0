package com.carddex.sims2.shedule;

import java.net.MalformedURLException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.carddex.sims2.security.service.WsService;


@Component
public class ScheduledTasks {

	private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

	private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
	
	@Autowired
	private WsService service;

	@Scheduled(fixedRate = 10000)
	public void reportCurrentTime() {
		log.info("The time is now {}", dateFormat.format(new Date()));
		try {
			service.getWS();
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
	}
}