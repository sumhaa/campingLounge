package com.project01_teamA.camping_lounge.repository.camp;

import com.project01_teamA.camping_lounge.entity.camp.Campsite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CampRepository extends JpaRepository<Campsite, Long>, CampRepositoryCustom {

    // 게시글 상세 조회
    Optional<Campsite> findById(Long campId);

    // 첫 페이징 화면("/")
    Page<Campsite> findAll(Pageable pageable);

}
