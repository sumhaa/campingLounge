package com.project01_teamA.camping_lounge.dto.request.member;

import com.project01_teamA.camping_lounge.common.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class AdminRegisterDto {

    private String email;
    private String name;
    private String password;
    private String gender;
    private String tel;
    private String securityKey;
    private Date join_date;
    private Role role;

    @Builder
    public AdminRegisterDto(String email, String name, String password, String gender, String tel, String securityKey, Date join_date, Role role) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.gender = gender;
        this.tel = tel;
        this.securityKey = securityKey;
        this.join_date = join_date;
        this.role = role;
    }
}
