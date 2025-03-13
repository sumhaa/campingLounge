package com.project01_teamA.camping_lounge.dto.request.member;

import com.project01_teamA.camping_lounge.common.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * -Request-
 * 회원 정보 변경 요청 dto
 */

@Getter
@Setter
@NoArgsConstructor
public class MemberUpdateDto {

    private String email;
    private String name;
    private String password;
    private String gender;
    private String tel;
    private String address;
    private String address_detail;
    private String postcode;
    private boolean enable;
    private Role role;
    private boolean profile;

    @Builder

    public MemberUpdateDto(String email, String name, String password, String gender, String tel, String address, String address_detail, String postcode, boolean profile, boolean enable, Role role) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.gender = gender;
        this.tel = tel;
        this.address = address;
        this.address_detail = address_detail;
        this.postcode = postcode;
        this.profile = profile;
        this.enable = enable;
        this.role = role;
    }
}


