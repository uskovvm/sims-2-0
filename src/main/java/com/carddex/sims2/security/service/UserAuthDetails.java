package com.carddex.sims2.security.service;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;

public class UserAuthDetails {
	private Long id; // идпользователя
	private String username; // имя пользователя
	private Integer blocked; // аккаунт заблокирован
	private Integer registerDate; // дата регистрации аккаунта
	private Collection<? extends GrantedAuthority> roles; // ид ролей пользователя
	private Collection<? extends GrantedAuthority> permissions; // ид разрешений

	public UserAuthDetails() {
	}

	public UserAuthDetails(Long id, String username, int blocked, int registerDate, Collection<? extends GrantedAuthority> roles,
			Collection<? extends GrantedAuthority> privileges) {
		this.id = id;
		this.username = username;
		this.blocked = blocked;
		this.registerDate = registerDate;
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

	public Collection<? extends GrantedAuthority> getRoles() {
		return roles;
	}

	public void setRoles(Collection<? extends GrantedAuthority> roles) {
		this.roles = roles;
	}

	public Collection<? extends GrantedAuthority> getPermissions() {
		return permissions;
	}

	public void setPermissions(Collection<? extends GrantedAuthority> permissions) {
		this.permissions = permissions;
	}
}
