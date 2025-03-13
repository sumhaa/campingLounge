package com.project01_teamA.camping_lounge.repository;

import com.project01_teamA.camping_lounge.entity.Member;
import com.project01_teamA.camping_lounge.entity.camp.Campsite;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    @Transactional
    Optional<Member> findByEmail(String email);

    Page<Member> findAll(Pageable pageable);
    Long countByEnableFalse();
    Long countByGender(String gender);
}