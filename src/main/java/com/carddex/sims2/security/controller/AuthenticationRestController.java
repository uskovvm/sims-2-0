package com.carddex.sims2.security.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.carddex.sims2.model.Module;
import com.carddex.sims2.preferences.ResponseConstants;
import com.carddex.sims2.rest.dto.DepartmentsResp;
import com.carddex.sims2.rest.dto.ZonesResp;
import com.carddex.sims2.security.JwtAuthenticationRequest;
import com.carddex.sims2.security.JwtTokenUtil;
import com.carddex.sims2.security.JwtUser;
import com.carddex.sims2.security.SUser;
import com.carddex.sims2.security.service.DeparmentService;
import com.carddex.sims2.security.service.JwtAuthenticationResponse;
import com.carddex.sims2.security.service.ModuleService;
import com.carddex.sims2.security.service.UserAuthResponse;
import com.carddex.sims2.security.service.ZoneService;

@RestController
public class AuthenticationRestController {

	@Value("${jwt.header}")
	private String tokenHeader;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	@Qualifier("jwtUserDetailsService")
	private UserDetailsService userDetailsService;
	
	@Autowired
	private ModuleService moduleService;

	@Autowired
	private DeparmentService departmentService;

	@Autowired
	private ZoneService zoneService;
	

	
	@RequestMapping(value = "${jwt.route.authentication.path}", method = RequestMethod.POST)
	public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtAuthenticationRequest authenticationRequest)
			throws AuthenticationException {

		try {
			
			authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
			
		} catch (AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new UserAuthResponse(
					ResponseConstants.RESPONSE_ERROR, ResponseConstants.RESPONSE_DESCRIPTION_ERROR));
		} catch (DisabledException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new UserAuthResponse(
					ResponseConstants.RESPONSE_ERROR, ResponseConstants.RESPONSE_DESCRIPTION_ERROR));
		}

		SUser userDetails = (SUser) userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
		String token = jwtTokenUtil.generateToken(userDetails);

		return ResponseEntity.ok(new UserAuthResponse(token, userDetails));
	}

	@RequestMapping(value = "${jwt.route.authentication.refresh}", method = RequestMethod.GET)
	public ResponseEntity<?> refreshAndGetAuthenticationToken(HttpServletRequest request) {
		String authToken = request.getHeader(tokenHeader);
		final String token = authToken.substring(7);
		String username = jwtTokenUtil.getUsernameFromToken(token);
		JwtUser user = (JwtUser) userDetailsService.loadUserByUsername(username);

		if (jwtTokenUtil.canTokenBeRefreshed(token, user.getLastPasswordResetDate())) {
			String refreshedToken = jwtTokenUtil.refreshToken(token);
			return ResponseEntity.ok(new JwtAuthenticationResponse(refreshedToken));
		} else {
			return ResponseEntity.badRequest().body(null);
		}
	}
	
	@RequestMapping(value = "/core/api/modules", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<Module>> getModules() {

		return ResponseEntity.ok(moduleService.loadAllModules());
	}

	@RequestMapping(value = "personnel/api/departments", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<DepartmentsResp> getDepartments() {
		
		DepartmentsResp result = departmentService.loadAlldepartments();
		return ResponseEntity.ok(result);
	}

	@RequestMapping(value = "/zones/api/zones", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<ZonesResp> getZones() {
		
		ZonesResp result = zoneService.loadAll();
		return ResponseEntity.ok(result);
	}

	@RequestMapping(value = "/core/api/permission/objects", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List> getPermissionObjects(
			@RequestParam(name = "userId", required = false, defaultValue = "0") Long userId,
			@RequestParam(name = "roleId", required = false, defaultValue = "0") Long roleId,
			@RequestParam(name = "id") Long id) {

		List result = new ArrayList();
		result.add(new Long(1));
		result.add(new Long(2));
		result.add(new Long(3));
		result.add(new Long(4));
		result.add(new Long(5));
		result.add(new Long(6));
		result.add(new Long(7));
		result.add(new Long(8));
		result.add(new Long(9));
//
		return ResponseEntity.status(HttpStatus.OK).body(result);
	}


	@ExceptionHandler({ AuthenticationException.class })
	public ResponseEntity<String> handleAuthenticationException(AuthenticationException e) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
	}

	private void authenticate(String username, String password) {
		Objects.requireNonNull(username);
		Objects.requireNonNull(password);

		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
		} catch (DisabledException e) {
			throw new AuthenticationException("User is disabled!", e);
		} catch (BadCredentialsException e) {
			throw new AuthenticationException("Bad credentials!", e);
		}
	}
}
