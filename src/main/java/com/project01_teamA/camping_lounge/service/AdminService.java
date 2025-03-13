package com.project01_teamA.camping_lounge.service;

import com.project01_teamA.camping_lounge.dto.MemberDto;
import com.project01_teamA.camping_lounge.entity.Member;
import com.project01_teamA.camping_lounge.repository.MemberRepository;
import com.project01_teamA.camping_lounge.repository.ProfileFilesRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final MemberRepository memberRepository;
    private final ProfileFilesRepository profileFilesRepository;
    private final ProfileFileService profileFileService;

    public AdminService(MemberRepository memberRepository, ProfileFilesRepository profileFilesRepository, ProfileFileService profileFileService) {
        this.memberRepository = memberRepository;
        this.profileFilesRepository = profileFilesRepository;
        this.profileFileService = profileFileService;
    }

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    @Transactional
    public void deleteMember(Long id) {
        try {
            if (profileFilesRepository.findByMemberId(id).isPresent()) {
                profileFileService.deleteFile(id);
                profileFilesRepository.deleteByMemberId(id);
            }
            memberRepository.deleteById(id);
        } catch (Exception e) {
            throw new IllegalArgumentException(e);
        }
    }


    public void updateMember(Long memberId, MemberDto memberDto) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        member.setName(memberDto.getName());
        member.setGender(memberDto.getGender());
        member.setTel(memberDto.getTel());
        member.setEmail(memberDto.getEmail());
        member.setEnable(memberDto.isEnable());
        member.setRole(memberDto.getRole());

        System.out.println(member);

        memberRepository.save(member);

    }
}
