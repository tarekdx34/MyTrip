// // package com.mytrip.airline.config;

// // import org.springframework.context.annotation.Bean;
// // import org.springframework.context.annotation.Configuration;
// // import org.springframework.web.cors.CorsConfiguration;
// // import org.springframework.web.cors.CorsConfigurationSource;
// // import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// // import java.util.Arrays;

// // @Configuration
// // public class CorsConfig {

// //     @Bean
// //     public CorsConfigurationSource corsConfigurationSource() {
// //         CorsConfiguration configuration = new CorsConfiguration();
        
// //         // Allow specific origins (your frontend URLs)
// //         configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*", "http://127.0.0.1:*"));
        
// //         // Allow specific methods
// //         configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
// //         // Allow specific headers
// //         configuration.setAllowedHeaders(Arrays.asList("*"));
        
// //         // Allow credentials
// //         configuration.setAllowCredentials(true);
        
// //         // How long the response from a pre-flight request can be cached by clients
// //         configuration.setMaxAge(3600L);
        
// //         // Apply CORS configuration to all paths
// //         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
// //         source.registerCorsConfiguration("/**", configuration);
// //         return source;
// //     }
// // }

// package com.mytrip.airline.config;

// import org.springframework.context.annotation.Configuration;

// @Configuration
// public class CorsConfig {
//     // CORS configuration moved to SecurityConfig.java to avoid bean conflicts
//     // This class can be used for other non-security CORS related configurations if needed
// }