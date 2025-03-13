package com.project01_teamA.camping_lounge.config;

//import jhcode.blog.security.jwt.JwtAuthenticationEntryPoint;
//import jhcode.blog.security.jwt.JwtAuthenticationFilter;
import com.project01_teamA.camping_lounge.security.jwt.JwtAuthenticationEntryPoint;
import com.project01_teamA.camping_lounge.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    //HttpSecurity 객체를 매개변수로 받아 보안 규칙을 설정한 후 SecurityFilterChain 객체를 반환
    //filterChain 메서드 실행 시점 : 1. 애플리케이션 시작 됐을 때 2. 클라이언트 요청이 들어올 때
    //jwtAuthenticationEntryPoint : 요청 URL이 설정된 접근 정책에 따라 인증이 필요한지 확인하고, 인증되지 않은 요청은 jwtAuthenticationEntryPoint에서 처리
    //참고 : 스프링 시큐리티는 클라이언트의 요청이 여러개의 필터를 거쳐 DispatcherServlet(Controller)으로 향하는 중간 필터에서 요청을 가로챈 후 검증(인증/인가)을 진행한다.
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
        .httpBasic(httpBasic -> httpBasic.disable())
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource))

        .authorizeHttpRequests(authorize
                -> authorize
                .requestMatchers(
                        "/*",
                        "/*/*",
                        "/admin/**",
                        "/app/**",
                        "/camp/**",
                        "/chat/**",
                        "/member/login",
                        "/member/auth/google",
                        "/review/**",
                        "/topic/**",
                        "/uploads/**"
                ).permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/camp/**").hasAnyRole("ADMIN", "USER")
                .requestMatchers("/chat/**").hasAnyRole("ADMIN", "USER")
                .requestMatchers("/member/**").hasAnyRole("ADMIN", "USER") // 로그인 제외, 나머지는 인증 필요
                .requestMatchers("/memberDetail/**").hasAnyRole("ADMIN", "USER")
                .requestMatchers("/review/**").hasAnyRole("ADMIN", "USER")
                .anyRequest().authenticated()
        )


        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .exceptionHandling(excep -> excep.authenticationEntryPoint(jwtAuthenticationEntryPoint))
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
    }


}
