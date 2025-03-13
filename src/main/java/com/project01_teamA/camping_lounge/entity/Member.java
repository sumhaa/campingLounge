package com.project01_teamA.camping_lounge.entity;

import com.project01_teamA.camping_lounge.common.Role;
import com.project01_teamA.camping_lounge.dto.request.member.MemberUpdateDto;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;


@Getter
@Setter
@Entity
@NoArgsConstructor
public class Member extends BaseTimeEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @Column(nullable = false, name = "member_email", unique = true)
    private String email;

    @Column(nullable = false, name = "member_name")
    private String name;

    @Column(name = "member_password")
    private String password;

    // 문자열로 sql에 저장되게 하기
    @Enumerated(EnumType.STRING)
    @Column(name = "member_role")
    private Role role;

    @Column(name = "member_gender")
    private String gender;

    @Column(name = "member_tel")
    private String tel;

    @Column(name = "member_postcode")
    private String postcode;

    @Column(name = "member_address")
    private String address;

    @Column(name = "member_address_detail")
    private String address_detail;

    @Column(name = "member_enable")
    private boolean enable;

    @Column(name = "member_profile")
    private boolean profile;

    @Column(name = "member_disabled_date")
    private Date disabled_date;

    @Column(name = "member_delete_date")
    private Date delete_date;

    @Column(name = "member_join_date")
    private Date join_date;

    private String profile_url;

	@Transient
    private String token;

    //@OneToMany(mappedBy = "member", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    //public List<Board> boards = new ArrayList<>();

    //@OneToMany(mappedBy = "member", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    //public List<Comment> comments = new ArrayList<>();




    //== 생성자 Builder ==//
    @Builder
    public Member(Long id, String email, String name, String password, Role role, String gender, String tel, String postcode, String address, String address_detail, boolean enable, boolean profile, Date disabled_date, Date delete_date, Date join_date, String profile_url, String token) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.password = password;
        this.role = role;
        this.gender = gender;
        this.tel = tel;
        this.postcode = postcode;
        this.address = address;
        this.address_detail = address_detail;
        this.enable = enable;
        this.profile = profile;
        this.disabled_date = disabled_date;
        this.delete_date = delete_date;
        this.join_date = join_date;
        this.profile_url = profile_url;
        this.token = token;
    }


    //== update ==//
    public void update(String password, MemberUpdateDto memberUpdateDto) {
        this.password = password;
        this.name = memberUpdateDto.getName();
        //this.email = memberUpdateDto.getEmail();
        this.gender = memberUpdateDto.getGender();
        this.tel = memberUpdateDto.getTel();
        this.profile = memberUpdateDto.isProfile();
        this.address = memberUpdateDto.getAddress();
        this.address_detail = memberUpdateDto.getAddress_detail();
        this.postcode = memberUpdateDto.getPostcode();
//        20250227 수정 - 김성우
        this.enable = memberUpdateDto.isEnable();
        this.role = memberUpdateDto.getRole() != null ? memberUpdateDto.getRole() : Role.USER;
    }

    //========== UserDetails implements ==========//
    /**
     * Token을 고유한 Email 값으로 생성합니다
     * @return email;
     */
    @Override
    public String getUsername() {
        return email;
    }

    //Authentication 객체에 부여된 권한을 String으로 반환
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add( new SimpleGrantedAuthority("ROLE_" + this.role.name()));
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}