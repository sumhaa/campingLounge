package com.project01_teamA.camping_lounge.repository;

import com.project01_teamA.camping_lounge.entity.MemberProfileFiles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileFilesRepository extends JpaRepository<MemberProfileFiles, Long> {
    Optional<MemberProfileFiles> findByMemberId(Long id);
    void deleteByMemberId(Long id);
}
