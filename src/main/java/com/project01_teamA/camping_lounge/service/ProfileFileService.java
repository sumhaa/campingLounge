package com.project01_teamA.camping_lounge.service;

import com.project01_teamA.camping_lounge.entity.Member;
import com.project01_teamA.camping_lounge.entity.MemberProfileFiles;
import com.project01_teamA.camping_lounge.repository.MemberRepository;
import com.project01_teamA.camping_lounge.repository.ProfileFilesRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProfileFileService {
    private final MemberRepository memberRepository;
    private final ProfileFilesRepository profileFilesRepository;
    private final String UPLOAD_DIR = Paths.get(System.getProperty("user.dir"), "uploads").toString();

    public ProfileFileService(MemberRepository memberRepository, ProfileFilesRepository profileFilesRepository) {
        this.memberRepository = memberRepository;
        this.profileFilesRepository = profileFilesRepository;
    }

    // 기존 프로필 잇으면 삭제 ( 파일 + DB )
    public void deleteFile(Long id) {
        Optional<MemberProfileFiles> existingProfile = profileFilesRepository.findByMemberId(id);
        if (existingProfile.isPresent()) {
            Path oldFilePath = Paths.get(UPLOAD_DIR, existingProfile.get().getStored_file_name());
            File oldFile = oldFilePath.toFile();
            if (oldFile.exists()) {
                if (oldFile.delete()) {
                    System.out.println("이전 프로필 삭제 성공: " + oldFile.getAbsolutePath());
                } else {
                    System.out.println("이전 프로필 삭제 실패: " + oldFile.getAbsolutePath());
                }
            }
            profileFilesRepository.delete(existingProfile.get());
        }
    }

    public String uploadFile(Long id, MultipartFile file) {
        Optional<Member> member = memberRepository.findById(id);

        if (member.isEmpty()) {
            return "회원을 찾지 못했습니다.";
        };

        String filename = file.getOriginalFilename();

        // 폴더 없으면 폴더 생성
        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        deleteFile(id);

        // 새 파일 저장
        String storedFileName = UUID.randomUUID().toString() + "_" + filename;
        Path filePath = Path.of(UPLOAD_DIR , storedFileName);

        try {
            file.transferTo(filePath.toFile());
        } catch (IOException e) {
            return "파일 저장 중 오류 발생 : " + e.getMessage();
        }

        // DB에 파일 정보 저장
        MemberProfileFiles memberProfileFiles = new MemberProfileFiles();

        memberProfileFiles.setMember(member.get());
        memberProfileFiles.setOrigin_file_name(filename);
        memberProfileFiles.setStored_file_name(storedFileName);

        profileFilesRepository.save(memberProfileFiles);

        return "프로필 업로드 성공";
    }

    public String getProfileImagePath(Long id) {
        MemberProfileFiles memberProfileFiles = profileFilesRepository.findByMemberId(id)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        return memberProfileFiles.getStored_file_name();
    }


}
