package com.carddex.sims2.security.service;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;

public class UserAuthDetails {
	private Long id; // идпользователя
	private String username; // имя пользователя
	private Integer blocked; // аккаунт заблокирован
	private Integer registerDate; // дата регистрации аккаунта
	private String avatar;
	private Collection<Long> roles; // ид ролей пользователя
	private Collection<Long> permissions; // ид разрешений

	public UserAuthDetails() {
	}

	public UserAuthDetails(Long id, String username, Integer blocked, Integer registerDate, String avatar, Collection<Long> roles,
			Collection<Long> privileges) {
		this.id = id;
		this.username = username;
		this.blocked = blocked;
		this.registerDate = registerDate;
		this.avatar = avatar;
		this.roles = roles;
		this.permissions = privileges;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Integer getBlocked() {
		return blocked;
	}

	public void setBlocked(Integer blocked) {
		this.blocked = blocked;
	}

	public Integer getRegisterDate() {
		return registerDate;
	}

	public void setRegisterDate(Integer registerDate) {
		this.registerDate = registerDate;
	}

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

	public Collection<Long> getRoles() {
		return roles;
	}

	public void setRoles(Collection<Long> roles) {
		this.roles = roles;
	}

	public Collection<Long> getPermissions() {
		return permissions;
	}

	public void setPermissions(Collection<Long> permissions) {
		this.permissions = permissions;
	}
}
