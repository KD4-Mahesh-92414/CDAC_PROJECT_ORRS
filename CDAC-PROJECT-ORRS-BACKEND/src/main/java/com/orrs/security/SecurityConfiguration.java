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
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

	private final CustomJwtVerificationFilter jwtFilter;
	private final CorsConfigurationSource corsConfigurationSource;
	
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
		// Enable CORS with custom configuration
		.cors(cors -> cors.configurationSource(corsConfigurationSource))
		
		// Disable CSRF for stateless API
		.csrf(csrf -> csrf.disable())
		
		// Stateless session management
		.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
		
		// Configure authorization rules
		.authorizeHttpRequests(request -> request
			
			// === PUBLIC ENDPOINTS (No Authentication Required) ===
			
			// Swagger/OpenAPI Documentation
			.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
			
			// Authentication endpoints
			.requestMatchers(HttpMethod.POST, "/users/login", "/users/register").permitAll()
			
			// Train search (public access)
			.requestMatchers(HttpMethod.POST, "/schedule/search").permitAll()
			
			// PNR Status check (public access)
			.requestMatchers(HttpMethod.POST, "/pnr/status").permitAll()
			
			// Train status (public access)
			.requestMatchers(HttpMethod.GET, "/api/train-status/**").permitAll()
			
			// Stations list (public access for autocomplete)
			.requestMatchers(HttpMethod.GET, "/api/stations").permitAll()
			
			// === ADMIN ENDPOINTS (Admin Role Required) ===
			
			// Admin Dashboard
			.requestMatchers("/admin/dashboard/**").hasRole("ADMIN")
			
			// Admin User Management
			.requestMatchers("/admin/users/**").hasRole("ADMIN")
			
			// Admin Station Management  
			.requestMatchers("/admin/stations/**").hasRole("ADMIN")
			
			// Admin Train Management
			.requestMatchers("/admin/trains/**").hasRole("ADMIN")
			
			// Admin Fare Management
			.requestMatchers("/admin/fares/**").hasRole("ADMIN")
			
			// Admin Refund Management
			.requestMatchers("/admin/refunds/**").hasRole("ADMIN")
			
			// Admin Announcements
			.requestMatchers("/admin/announcements/**").hasRole("ADMIN")
			
			// Admin Booking Management
			.requestMatchers("/admin/bookings/**").hasRole("ADMIN")
			
			// Admin Coach Type Management
			.requestMatchers("/admin/coach-types/**").hasRole("ADMIN")
			
			// Admin Seat Layout Management
			.requestMatchers("/admin/seat-layouts/**").hasRole("ADMIN")
			
			// Admin Train Route Management
			.requestMatchers("/admin/train-routes/**").hasRole("ADMIN")
			
			// === USER ENDPOINTS (Authentication Required) ===
			
			// User Profile Management
			.requestMatchers(HttpMethod.GET, "/users/me").authenticated()
			.requestMatchers(HttpMethod.PUT, "/users/update/me").authenticated()
			.requestMatchers(HttpMethod.PATCH, "/users/update/password").authenticated()
			.requestMatchers(HttpMethod.DELETE, "/users/me").authenticated()
			
			// Booking Management (requires authentication)
			.requestMatchers("/api/booking/**").authenticated()
			
			// Seat Matrix (requires authentication for booking flow)
			.requestMatchers(HttpMethod.POST, "/api/seats/**").authenticated()
			
			// User Booking History and Management
			.requestMatchers("/users/bookings/**").authenticated()
			
			// === PROTECTED ENDPOINTS (Authentication Required) ===
			
			// All other endpoints require authentication
			.anyRequest().authenticated()
		)
		
		// Add JWT filter before authentication filter
		.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
		
		return http.build();
	}
	
	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
}
