package com.project01_teamA.camping_lounge.dto.response.member;

import com.project01_teamA.camping_lounge.common.Role;
import com.project01_teamA.camping_lounge.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

/**
 * -Response-
 * 사용자 정보 반환 Dto
 */

@Getter
@Setter
@NoArgsConstructor
public class MemberResponseDto {
    private Long id;
    private String email;
    private String name;
    private String token;
    private Role role;
    private String gender;
    private String tel;
    private boolean enable;
    private boolean profile;
    private String postcode;
    private String address;
    private String address_detail;
    private Date disabled_date;
    private Date delete_date;
    private Date join_date;
    private String profile_url;

    @Builder
    public MemberResponseDto(String profile_url, Long id, String postcode, String address, String address_detail, String tel, String email, String name, String token, Role role, String gender, boolean enable, boolean profile, Date disabled_date, Date delete_date, Date join_date) {
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
        this.postcode = postcode;
        this.address = address;
        this.address_detail = address_detail;
        this.profile_url = profile_url;
    }


    // Entity -> DTO
    public static MemberResponseDto fromEntity(Member member) {
        return MemberResponseDto.builder()
                .id(member.getId())
                .email(member.getEmail())
                .name(member.getName())
                .token(member.getToken())
                .tel(member.getTel())
                .role(member.getRole())
                .gender(member.getGender())
                .enable(member.isEnable())
                .profile(member.isProfile())
                .disabled_date(member.getDisabled_date())
                .delete_date(member.getDelete_date())
                .join_date(member.getJoin_date())
                .postcode(member.getPostcode())
                .address(member.getAddress())
                .address_detail(member.getAddress_detail())
                .profile_url(member.getProfile_url())
                .build();
    }
}
