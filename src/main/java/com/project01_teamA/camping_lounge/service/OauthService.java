package com.project01_teamA.camping_lounge.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.auth.oauth2.GoogleAuthUtils;
import com.project01_teamA.camping_lounge.common.Role;
import com.project01_teamA.camping_lounge.dto.request.member.MemberRegisterDto;
import com.project01_teamA.camping_lounge.dto.response.member.MemberResponseDto;
import com.project01_teamA.camping_lounge.entity.Member;
import com.project01_teamA.camping_lounge.repository.MemberRepository;
import com.project01_teamA.camping_lounge.security.jwt.JwtTokenUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AuthorizationServiceException;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class OauthService {
    private final MemberRepository memberRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final UserDetailsService userDetailsService;
    private final MemberService memberService;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    // 1. 구글 토큰이 신뢰할 수 잇는 토큰인지 검증
    // 2. 정보가 없으면 회원가입
    // 3. 토큰 발급
    public Map<String, String> googleLogin(String token) {

        try {
            // GoogleIdTokenVerifier : 구글에서 제공하는 토큰 검증 클래스
            // NetHttpTransport : HTTP 통신을 처리
            // JacksonFactory : JSON 데이터를 읽고 분석함
            // setAudience : 클라이언트 ID가 인증화면 id와 같은지 검증
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(token);
            if (idToken == null) {
                System.out.println("유효하지 않은 토큰");
                throw new AuthorizationServiceException("유효하지 않은 토큰");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String name = payload.get("name").toString();
            String profile_url = payload.get("picture").toString();

            Optional<Member> member = memberRepository.findByEmail(email);


            if(member.isEmpty()) {
                Member newMember = Member.builder()
                        .email(email)
                        .name(name)
                        .role(Role.USER)
                        .enable(true)
                        .join_date(new Date())
                        .profile_url(profile_url)
                        .build();

                System.out.println(newMember);

                memberRepository.save(newMember);
            } else {
                System.out.println(member);
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            String jwtToken = jwtTokenUtil.generateToken(userDetails);

            Map<String, String> map = new HashMap<>();
            map.put("email", email);
            map.put("token", jwtToken);

            MemberResponseDto user = memberService.getUserByEmail(email);
            map.put("id", user.getId().toString());
            map.put("enable", user.isEnable() ? "true" : "false");

            return map;

        } catch (Exception e) {
            System.out.println("토큰 검증 중 예외 발생 : " + e.getMessage());
            throw new AuthorizationServiceException("신뢰할 수 없는 토큰");
        }
    }
}
