package com.project01_teamA.camping_lounge.dto;

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
    private String email;
    private String name;
    private Role role;
    private String gender;
    private String tel;
    private boolean profile;
    private Date join_date;
    private boolean enable;

    @Builder
    public MemberDto(String email, String name, Role role, String gender, String tel, boolean profile, Date join_date, boolean enable) {
        this.email = email;
        this.name = name;
        this.role = role;
        this.gender = gender;
        this.tel = tel;
        this.profile = profile;
        this.join_date = join_date;
        this.enable = enable;
    }
}
