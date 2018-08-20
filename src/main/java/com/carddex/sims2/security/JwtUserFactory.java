package com.carddex.sims2.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.carddex.sims2.model.security.Privilege;
import com.carddex.sims2.model.security.Role;
import com.carddex.sims2.model.security.User;

public final class JwtUserFactory {

	private JwtUserFactory() {
	}

	public static SUser create(User user) {
		// @formatter:off
		return new SUser(
				user.getId(),
				user.getUsername(),
				user.getFirstname(),
				user.getLastname(),
				user.getEmail(),
				user.getPassword(), 
				mapToGrantedAuthorities(user.getRoles()),
				mapToGrantedPrivileges(user.getRoles()),
				user.getEnabled(),
				user.getLastPasswordResetDate());
		// @formatter:on
	}

	private static List<Long> mapToGrantedAuthorities(List<Role> authorities) {
		//return authorities.stream().map(authority -> new SimpleGrantedAuthority(authority.getName().name()))
		//		.collect(Collectors.toList());
		return authorities.stream().map(authority -> authority.getId()).collect(Collectors.toList());

	}

	private static List<Long> mapToGrantedPrivileges(List<Role> authorities) {
		List<Long> privileges = new ArrayList<Long>();
		for (Role authority : authorities) {
			Collection<Privilege> result = authority.getPrivileges();
			for (Privilege privilege : result) {
				privileges.add(privilege.getId());
			}
		}
		return privileges;
	}

	private static List<GrantedAuthority> mapToGrantedAuthorities_COPY(List<Role> authorities) {
		//return authorities.stream().map(authority -> new SimpleGrantedAuthority(authority.getName().name()))
		//		.collect(Collectors.toList());
		return authorities.stream().map(authority -> new SimpleGrantedAuthority(authority.getId().toString()))
				.collect(Collectors.toList());

	}

	private static List<SimpleGrantedAuthority> mapToGrantedPrivileges_COPY(List<Role> authorities) {
		List<SimpleGrantedAuthority> privileges = new ArrayList<SimpleGrantedAuthority>();
		for (Role authority : authorities) {
			Collection<Privilege> result = authority.getPrivileges();
			for (Privilege privilege : result) {
				privileges.add(new SimpleGrantedAuthority(privilege.getName()));
			}
		}
		return privileges;
	}

}
