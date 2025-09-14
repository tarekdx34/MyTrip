// package com.mytrip.airline.config;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// import java.util.Arrays;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {

//     @Autowired
//     private JwtAuthenticationFilter jwtAuthenticationFilter;

//     @Bean
//     public CorsConfigurationSource corsConfigurationSource() {
//         CorsConfiguration configuration = new CorsConfiguration();
        
//         // More secure: Allow specific origins (your frontend URLs)
//         // Use this for production - be more specific with your origins
//         configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*", "http://127.0.0.1:*"));
        
//         // For development only - you can temporarily use "*" but it's not recommended for production
//         // configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        
//         // Allow specific methods
//         configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
//         // Allow specific headers
//         configuration.setAllowedHeaders(Arrays.asList("*"));
        
//         // Allow credentials (important for authentication)
//         configuration.setAllowCredentials(true);
        
//         // How long the response from a pre-flight request can be cached by clients
//         configuration.setMaxAge(3600L);
        
//         // Apply CORS configuration to all paths
//         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         source.registerCorsConfiguration("/**", configuration);
//         return source;
//     }

//     @Bean
//     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//         http.csrf(csrf -> csrf.disable())
//             .cors(cors -> cors.configurationSource(corsConfigurationSource()))
//             .authorizeHttpRequests(authz -> authz
//                 .requestMatchers("/api/auth/**").permitAll()
//                 .requestMatchers("/api/admin/**").hasRole("ADMIN")
//                 .requestMatchers("/api/crew/**").hasRole("CREW")
//                 .requestMatchers("/api/frontdesk/**").hasRole("FRONT_DESK")
//                 .requestMatchers("/api/passenger/**").hasRole("PASSENGER")
//                 .anyRequest().authenticated()
//             )
//             .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

//         http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

//         return http.build();
//     }
// }

/* old working for login and register but nor for users */

// package com.mytrip.airline.config;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// import java.util.Arrays;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {

//     @Autowired
//     private JwtAuthenticationFilter jwtAuthenticationFilter;

//     @Bean
//     public CorsConfigurationSource corsConfigurationSource() {
//         CorsConfiguration configuration = new CorsConfiguration();
        
//         // More secure: Allow specific origins (your frontend URLs)
//         // Use this for production - be more specific with your origins
//         configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*", "http://127.0.0.1:*"));
        
//         // For development only - you can temporarily use "*" but it's not recommended for production
//         // configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        
//         // Allow specific methods
//         configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
//         // Allow specific headers
//         configuration.setAllowedHeaders(Arrays.asList("*"));
        
//         // Allow credentials (important for authentication)
//         configuration.setAllowCredentials(true);
        
//         // How long the response from a pre-flight request can be cached by clients
//         configuration.setMaxAge(3600L);
        
//         // Apply CORS configuration to all paths
//         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         source.registerCorsConfiguration("/**", configuration);
//         return source;
//     }

//     @Bean
//     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//         http.csrf(csrf -> csrf.disable())
//             .cors(cors -> cors.configurationSource(corsConfigurationSource()))
//             .authorizeHttpRequests(authz -> authz
//                 .requestMatchers("/", "/health", "/actuator/**").permitAll()  // Allow root and health checks
//                 .requestMatchers("/api/auth/**").permitAll()
//                 .requestMatchers("/api/admin/**").hasRole("ADMIN")
//                 .requestMatchers("/api/crew/**").hasRole("CREW")
//                 .requestMatchers("/api/frontdesk/**").hasRole("FRONT_DESK")
//                 .requestMatchers("/api/passenger/**").hasRole("PASSENGER")
//                 .anyRequest().authenticated()
//             )
//             .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

//         http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

//         return http.build();
//     }
// }


/*  */

package com.mytrip.airline.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
// Comment out @EnableMethodSecurity for development to disable @PreAuthorize
// @EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow specific origins for development
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*", "http://127.0.0.1:*"));
        
        // Allow specific methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Allow specific headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Allow credentials
        configuration.setAllowCredentials(true);
        
        // Cache time for preflight requests
        configuration.setMaxAge(3600L);
        
        // Apply CORS configuration to all paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // DEVELOPMENT MODE: Allow all requests without authentication
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(authz -> authz
                .anyRequest().permitAll()  // Allow everything for development
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Comment out JWT filter for development
        // http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    
    // PRODUCTION SECURITY CONFIGURATION - UNCOMMENT WHEN READY FOR PRODUCTION
    // Also uncomment @EnableMethodSecurity at the top of the class
    
    // @Bean
    // public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    //     http.csrf(csrf -> csrf.disable())
    //         .cors(cors -> cors.configurationSource(corsConfigurationSource()))
    //         .authorizeHttpRequests(authz -> authz
    //             // Public endpoints - no authentication required
    //             .requestMatchers("/", "/health", "/actuator/**").permitAll()
    //             .requestMatchers("/api/auth/**").permitAll()
                
    //             // Public read endpoints for basic data
    //             .requestMatchers("/api/airports/**").permitAll()
    //             .requestMatchers("/api/aircraft/**").permitAll()
    //             .requestMatchers("/api/flights/**").permitAll()
                
    //             // User management - allow basic operations for now
    //             .requestMatchers("/api/users/email-available").permitAll()
    //             .requestMatchers("/api/profile").authenticated()
                
    //             // Admin-only endpoints
    //             .requestMatchers("/api/admin/**").hasRole("ADMIN")
    //             .requestMatchers("/api/users/stats").hasRole("ADMIN")
    //             .requestMatchers("/api/users/activity").hasRole("ADMIN")
    //             .requestMatchers("/api/reports/**").hasRole("ADMIN")
                
    //             // Role-specific endpoints
    //             .requestMatchers("/api/crew/**").hasAnyRole("CREW", "ADMIN")
    //             .requestMatchers("/api/front-desk/**").hasAnyRole("FRONT_DESK", "ADMIN")
    //             .requestMatchers("/api/passengers/**").hasAnyRole("PASSENGER", "ADMIN", "FRONT_DESK")
                
    //             // General authenticated endpoints
    //             .requestMatchers("/api/bookings/**").authenticated()
    //             .requestMatchers("/api/tickets/**").authenticated()
    //             .requestMatchers("/api/payments/**").authenticated()
    //             .requestMatchers("/api/checkin/**").authenticated()
    //             .requestMatchers("/api/notifications/**").authenticated()
                
    //             // Allow general user operations for authenticated users
    //             .requestMatchers("/api/users/*/login-history").authenticated()
                
    //             // Default: require authentication
    //             .anyRequest().authenticated()
    //         )
    //         .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

    //     http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    //     return http.build();
    // }
    
}