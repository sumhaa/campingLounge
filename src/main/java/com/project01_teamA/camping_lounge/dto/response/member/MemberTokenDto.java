package com.project01_teamA.camping_lounge.dto.response.member;

import com.project01_teamA.camping_lounge.common.Role;
import com.project01_teamA.camping_lounge.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;

/**
 * -Response-
 * 사용자 정보 반환 + token Dto
 */

@Getter
@Setter
@NoArgsConstructor
public class MemberTokenDto implements UserDetails {
    private Long id;
    private String email;
    private String token;
    private String name;
    private Role role;
    private String gender;
    private String tel;
    private boolean enable;
    private boolean profile;
    private Date disabled_date;
    private Date delete_date;
    private Date join_date;

    @Builder
    public MemberTokenDto(Long id, String tel, String email, String name, String token, Role role, String gender, boolean enable, boolean profile, Date disabled_date, Date delete_date, Date join_date) {
        this.id = id;
        this.tel = tel;
        this.email = email;
        this.name = name;
        this.token = token;
        this.role = role;
        this.gender = gender;
        this.enable = enable;
        this.profile = profile;
        this.disabled_date = disabled_date;
        this.delete_date = delete_date;
        this.join_date = join_date;
    }

    // Entity -> DTO
    public static MemberTokenDto fromEntity(UserDetails userDetails, String token) {
        if (!(userDetails instanceof Member)) {
            throw new IllegalArgumentException("UserDetails 객체가 Member 타입이 아닙니다.");
        }
        Member member = (Member) userDetails;

        return MemberTokenDto.builder()
                .id(member.getId())
                .email(member.getEmail())
                .name(member.getName())
                .token(token)
                .tel(member.getTel())
                .role(member.getRole())
                .gender(member.getGender())
                .enable(member.isEnable())
                .profile(member.isProfile())
                .disabled_date(member.getDisabled_date())
                .delete_date(member.getDelete_date())
                .join_date(member.getJoin_date())
                .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return "";
    }

    @Override
    public String getUsername() {
        return "";
    }

    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    @Override
    public boolean isAccountNonLocked() {
        return false;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @Override
    public boolean isEnabled() {
        return false;
    }
}
