package com.project01_teamA.camping_lounge.dto.response.member;

import com.project01_teamA.camping_lounge.common.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class MemberDto {
    private Long id;
    private String email;
    private String name;
    private Role role;
    private String gender;
    private String tel;
    private String address;
    private String address_detail;
    private String postcode;
    private boolean profile;
    private Date join_date;
    private boolean enable;

    @Builder

    public MemberDto(Long id, String email, String name, Role role, String gender, String tel, String address, String address_detail, String postcode, boolean profile, Date join_date, boolean enable) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.gender = gender;
        this.tel = tel;
        this.address = address;
        this.address_detail = address_detail;
        this.postcode = postcode;
        this.profile = profile;
        this.join_date = join_date;
        this.enable = enable;
    }
}
