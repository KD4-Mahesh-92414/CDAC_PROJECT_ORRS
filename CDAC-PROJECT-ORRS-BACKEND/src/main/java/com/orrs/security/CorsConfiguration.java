package com.orrs.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * CORS Configuration for ORRS Application
 * Allows frontend access from React development server and production builds
 */
@Configuration
public class CorsConfiguration {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        
        // Allow frontend URLs
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:3000",      // React dev server default
            "http://localhost:5173",      // Vite dev server default  
            "http://localhost:5174",      // Vite dev server alternate
            "http://127.0.0.1:3000",      // Local IP variant
            "http://127.0.0.1:5173",      // Local IP variant
            "http://127.0.0.1:5174",      // Local IP variant
            "https://*.vercel.app",       // Vercel deployments
            "https://*.netlify.app",      // Netlify deployments
            "https://*.herokuapp.com"     // Heroku deployments
        ));
        
        // Allow all HTTP methods
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"
        ));
        
        // Allow all headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Allow credentials (for JWT tokens)
        configuration.setAllowCredentials(true);
        
        // Expose Authorization header to frontend
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "X-Requested-With", 
            "Accept", 
            "Origin", 
            "Access-Control-Request-Method", 
            "Access-Control-Request-Headers"
        ));
        
        // Cache preflight response for 1 hour
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}