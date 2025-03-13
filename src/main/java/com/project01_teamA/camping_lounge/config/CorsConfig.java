package com.project01_teamA.camping_lounge.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    /* CORS */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        //1.setAllowedOrigins - 도메인 허용
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
//        configuration.addAllowedHeader("*");
//        configuration.addAllowedMethod("*");
//        configuration.addAllowedOriginPattern("*");

        //2.setAllowedMethods - 허용 http
        configuration.setAllowedMethods(Arrays.asList("GET","POST","OPTIONS","PATCH", "DELETE", "PUT"));

        //3.setAllowedHeaders - 허용 Headers
        configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization"));

        //4.Credentials - 허용 안하면 'Access to XMLHttpRequest at~' 에러 발생
        configuration.setAllowCredentials(true);

        //5. 기타
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        //6.URL 기본설정
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;


    }

//    @Bean
//    public CorsFilter corsFilter() {
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        CorsConfiguration config = new CorsConfiguration();
//
//        config.setAllowCredentials(true);  // allowCredentials 설정
//        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));  // 특정 Origin만 허용
//        config.setAllowedMethods(Arrays.asList("GET","POST","OPTIONS","PATCH", "DELETE", "PUT"));
//        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
//        config.setExposedHeaders(Arrays.asList("Authorization"));
//
//        source.registerCorsConfiguration("/**", config);
//        return new CorsFilter(source);
//    }
}
