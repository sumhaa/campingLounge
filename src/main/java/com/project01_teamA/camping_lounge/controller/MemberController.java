package com.project01_teamA.camping_lounge.controller;

import com.project01_teamA.camping_lounge.dto.request.member.AdminRegisterDto;
import com.project01_teamA.camping_lounge.dto.request.member.MemberLoginDto;
import com.project01_teamA.camping_lounge.dto.request.member.MemberRegisterDto;
import com.project01_teamA.camping_lounge.dto.request.member.MemberUpdateDto;
import com.project01_teamA.camping_lounge.dto.response.member.MemberDto;
import com.project01_teamA.camping_lounge.dto.response.member.MemberResponseDto;
import com.project01_teamA.camping_lounge.dto.response.member.MemberTokenDto;
import com.project01_teamA.camping_lounge.entity.Member;
import com.project01_teamA.camping_lounge.service.MemberService;
import com.project01_teamA.camping_lounge.service.OauthService;
import com.project01_teamA.camping_lounge.service.ProfileFileService;
import com.project01_teamA.camping_lounge.service.SecurityKeyService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.Map;


@RestController
@RequestMapping("/member")
//@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;
    private final ProfileFileService profileFileService;
    private final SecurityKeyService securityKeyService;
    private final OauthService oauthService;

    public MemberController(MemberService memberService, ProfileFileService profileFileService, SecurityKeyService securityKeyService, OauthService oauthService) {
        this.memberService = memberService;
        this.profileFileService = profileFileService;
        this.securityKeyService = securityKeyService;
        this.oauthService = oauthService;
    }

    // 유저 기능

    @PostMapping("/join")
    public ResponseEntity<String> join(@RequestBody MemberRegisterDto memberRegisterDto) {
        memberService.join(memberRegisterDto);
        return ResponseEntity.status(HttpStatus.OK).body("회원가입 성공");
    }

    @PostMapping("/emailDuplicate")
    public ResponseEntity<Boolean> emailDuplicate(@RequestBody MemberRegisterDto memberRegisterDto) {
        return ResponseEntity.status(HttpStatus.OK).body(memberService.emailDuplicate(memberRegisterDto));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberLoginDto memberLoginDto) {
        MemberTokenDto loginDTO = memberService.login(memberLoginDto);
        // true 면 로그인 성공, false 로그인 실패
        if (loginDTO.isEnable()) {
            //.header(member.getToken() : JWT 데이터들 header로 넘겨줘야 함(매우 중요)
            return ResponseEntity.status(HttpStatus.OK).header(loginDTO.getToken()).body(loginDTO);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패: 탈퇴한 회원입니다.");
        }
    }

    //@AuthenticationPrincipal : 현재 로그인한 사용자의 인증 정보를 가져오는 어노테이션
    //Spring Security에서 제공하는 기능으로, JWT 인증 방식과 연동 가능
    @GetMapping("/user/{memberId}")
    public ResponseEntity<MemberResponseDto> getUser(@PathVariable Long memberId) {
        MemberResponseDto memberDto = memberService.getUser(memberId);
        return ResponseEntity.status(HttpStatus.OK).body(memberDto);
    }

    @GetMapping("/me")
    public ResponseEntity<MemberResponseDto> getMyInfo(@AuthenticationPrincipal Member member) {
        MemberResponseDto myInfo = MemberResponseDto.fromEntity(member);
        return ResponseEntity.status(HttpStatus.OK).body(myInfo);
    }


    @GetMapping("/unable")
    public ResponseEntity<String> userUnable(@AuthenticationPrincipal Member member) {
        if (member.isEnable()) {
            memberService.userDisabled(member);
            return ResponseEntity.status(HttpStatus.OK).body("유저 탈퇴 성공");
        } else {
            return ResponseEntity.status(HttpStatus.OK).body("이미 탈퇴 상태입니다");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<MemberResponseDto> userUpdate(@AuthenticationPrincipal Member member, @RequestBody MemberUpdateDto memberUpdateDTO) {
        memberUpdateDTO.setEnable(true);
        MemberResponseDto memberUpdate = memberService.userUpdate(member, memberUpdateDTO);
        return ResponseEntity.status(HttpStatus.OK).body(memberUpdate);
    }

    // 파일 기능

    @PostMapping("/upload")
    public ResponseEntity<String> fileUpload(@AuthenticationPrincipal Member member, @RequestParam MultipartFile file) {
        String response = profileFileService.uploadFile(member.getId(), file);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/getProfile/{memberId}")
    public ResponseEntity<String> getProfileImagePath(@PathVariable Long memberId) {
        String response = profileFileService.getProfileImagePath(memberId);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    @DeleteMapping("/deleteProfile")
    public ResponseEntity<String> deleteProfile(@AuthenticationPrincipal Member member) {
        profileFileService.deleteFile(member.getId());

        return ResponseEntity.status(HttpStatus.OK).body("파일 삭제 성공");
    }

    // 보안키 검증
    @PostMapping("/checkKey")
    public boolean checkKey(@RequestBody Map<String, String> request) {
        String inputKey = request.get("securityKey");
        return securityKeyService.validateSecurityKey(inputKey);
    }
    
    // 구글 로그인
    @PostMapping("/auth/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        String googleToken = request.get("token");

        Map<String,String> res = oauthService.googleLogin(googleToken);
        String jwtToken = res.get("token");
        if(res.get("enable").equals("false")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("탈퇴한 회원입니다.");
        }

        return ResponseEntity.status(HttpStatus.OK).header(jwtToken).body(res);
    }

    @GetMapping("/getProfileByUserId")
    public ResponseEntity<String> getProfileByUserId(@RequestParam Long userId) {
        String profilePath = profileFileService.getProfileImagePath(userId);
        return ResponseEntity.ok(profilePath);
    }

    @GetMapping("/getUserInfoById")
    public ResponseEntity<MemberResponseDto> getUserInfoById(@RequestParam Long id) {
        MemberResponseDto memberDto = memberService.getUserInfoById(id);
        return ResponseEntity.status(HttpStatus.OK).body(memberDto);
    }



}
