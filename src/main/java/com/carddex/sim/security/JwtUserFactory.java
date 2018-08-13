package com.carddex.sim.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.carddex.sim.model.security.Privilege;
import com.carddex.sim.model.security.Role;
import com.carddex.sim.model.security.User;

public final class JwtUserFactory {

	private JwtUserFactory() {
	}

	public static JwtUser create(User user) {
		// @formatter:off
		return new JwtUser(
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

	private static List<GrantedAuthority> mapToGrantedAuthorities(List<Role> authorities) {
		return authorities.stream().map(authority -> new SimpleGrantedAuthority(authority.getName().name()))
				.collect(Collectors.toList());
	}

	private static List<SimpleGrantedAuthority> mapToGrantedPrivileges(List<Role> authorities) {
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
