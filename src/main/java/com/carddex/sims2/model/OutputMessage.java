package com.carddex.sims2.model;

public class OutputMessage {
	
	private String from;
	private String text;
	private String format;

	public OutputMessage(String from, String text, String format) {

		this.from=from;
		this.text=text;
		this.format=format;
	}

	public String getFrom() {
		return from;
	}

	public void setFrom(String from) {
		this.from = from;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	
}
