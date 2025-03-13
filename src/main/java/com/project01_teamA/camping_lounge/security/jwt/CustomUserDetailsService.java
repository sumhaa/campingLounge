package com.project01_teamA.camping_lounge.security.jwt;


import com.project01_teamA.camping_lounge.entity.Member;
import com.project01_teamA.camping_lounge.exception.ResourceNotFoundException;
import com.project01_teamA.camping_lounge.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * DaoAuthenticationProvider 구현
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private MemberRepository memberRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Member member = memberRepo.findByEmail(username).orElseThrow(
                () -> new ResourceNotFoundException("ID 혹은 비밀번호", "Email", username));
        if(!member.isEnabled()) {
            throw new DisabledException("비활성화된 유저입니다.");
        }
        return member;

    }
}
