package com.carddex.sims2.security.service;

import com.carddex.sims2.preferences.ResponseConstants;
import com.carddex.sims2.security.SUser;
import com.fasterxml.jackson.annotation.JsonInclude;

public class UserAuthResponse {

	@JsonInclude(JsonInclude.Include.NON_NULL)//если ошибка определения прав доступа, то в ответ не включать
	private String token; // токен
	private String status; // статус операции
	private String description; // описание статуса
	@JsonInclude(JsonInclude.Include.NON_NULL)//если ошибка определения прав доступа, то в ответ не включать
	private UserAuthDetails response;


	public UserAuthResponse(String status, String description) {
		this.status = status;
		this.description = description;
	}

	public UserAuthResponse(String token, SUser user) {
		this.token = token;
		if (user != null) {
			this.status = ResponseConstants.RESPONSE_SUCCESS;
			this.description = ResponseConstants.RESPONSE_DESCRIPTION_SUCCESS;
			this.response = new UserAuthDetails(user.getId(), user.getUsername(), user.isEnabled() ? 0 : 1, null, null,
					user.getRoles(), user.getPrivileges());
		}else {
			this.status = ResponseConstants.RESPONSE_ERROR;
			this.description = ResponseConstants.RESPONSE_DESCRIPTION_ERROR;
		}
	}

	public UserAuthDetails getResponse() {
		return response;
	}

	public void setResponse(UserAuthDetails response) {
		this.response = response;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
}
