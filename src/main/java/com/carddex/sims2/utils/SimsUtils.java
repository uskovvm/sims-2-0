package com.carddex.sims2.utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SimsUtils {
	private static final Logger log = LoggerFactory.getLogger(SimsUtils.class);

	public static Date dateFromString(String stringDate) {
		DateFormat format = new SimpleDateFormat("dd.MM.yyyy", Locale.getDefault());
		Date date;
		try {
			date = format.parse(stringDate);
			return date;
		} catch (ParseException e) {
			log.error("Ошибка парсинга даты " + stringDate);
			log.error(e.getLocalizedMessage());

		}
		return null;
	}

	public static Boolean getBooleanFromString(String str) {
		return str.equals("да") ? true : false;
	}

}
