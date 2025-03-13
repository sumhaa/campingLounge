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
public class MemberRegisterDto {

    private String email;
    private String name;
    private String password;
    private String gender;
    private String tel;
    private String postcode;
    private String address;
    private String address_detail;
    private Date join_date;
    private Role role;

    @Builder
    public MemberRegisterDto(String email, String name, String password, String gender, String tel, String postcode, String address, String address_detail, Date join_date, Role role) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.gender = gender;
        this.tel = tel;
        this.postcode = postcode;
        this.address = address;
        this.address_detail = address_detail;
        this.join_date = join_date;
        this.role = role;
    }
}
