package com.orrs.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CustomJwtVerificationFilter extends OncePerRequestFilter {
	
	private final JwtUtils jwtUtils;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {	
		try {
			//1. Check for Authorization header in the incoming request -> get its value
			String authHeader = request.getHeader("Authorization");
			if(authHeader != null && authHeader.startsWith("Bearer ")) {
				
				String jwt = authHeader.substring(7);
				//2. validate token
				Claims claims = jwtUtils.validateToken(jwt);
				
				if (claims != null) {
					//3. Create authentication object - user id & user role
					//extract the claims
					Long userId = claims.get("user_id", Long.class);
					String role = claims.get("user_role", String.class);
					String email = claims.getSubject(); // JWT subject should contain email
					
					//4. Create UserPrincipal object (not JwtDTO)
					UserPrincipal userPrincipal = new UserPrincipal(
						userId, 
						email != null ? email : "unknown@email.com", // fallback email
						"", // password not needed for JWT auth
						List.of(new SimpleGrantedAuthority(role)),
						role
					);
					
					//5. Create authentication object with UserPrincipal
					Authentication authentication = new UsernamePasswordAuthenticationToken(
						userPrincipal, 
						null, 
						userPrincipal.getAuthorities()
					);
					
					//6. store Authentication object under spring security context
					SecurityContextHolder.getContext().setAuthentication(authentication);
				}
			}
		} catch (Exception e) {
			// Log the error but don't break the filter chain
			System.err.println("JWT Authentication failed: " + e.getMessage());
			// Clear any existing authentication
			SecurityContextHolder.clearContext();
		}
		
		//delegate request handling to the next filter in the chain
		filterChain.doFilter(request, response);
	}

}
