package com.orrs.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

	private final CorsConfigurationSource corsConfigurationSource;
	
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
		.cors(cors -> cors.configurationSource(corsConfigurationSource))
		.csrf((csrf)-> csrf.disable())
		.sessionManagement((session)-> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
		.authorizeHttpRequests( request ->
		  request
		  .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/users/login", "/users/register", "/schedule/**", "/api/seats/**").permitAll()
		  .requestMatchers(HttpMethod.GET, "/users", "/admin/**").permitAll()
		  .requestMatchers(HttpMethod.POST, "/admin/**").permitAll()
		  .requestMatchers(HttpMethod.PUT, "/admin/**").permitAll()
		  .requestMatchers(HttpMethod.DELETE, "/admin/**").permitAll()
		  .requestMatchers(HttpMethod.PATCH, "/admin/**").permitAll()
		  .anyRequest().authenticated());
		return http.build();
	}
	
	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
}
