package com.project01_teamA.camping_lounge.repository.review;

import com.project01_teamA.camping_lounge.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.PathVariable;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Review와 ReviewPopularity를 함께 조회하는 쿼리
    @Query("SELECT r FROM Review r LEFT JOIN FETCH r.reviewPopularity")
    Page<Review> findAllWithPopularity(Pageable pageable);

    // 조회수 높은 순으로 리뷰를 페이지 단위로 조회
    @Query("SELECT r FROM Review r  WHERE r.reviewHit >= 20 ORDER BY r.reviewHit DESC")
    Page<Review> findBestReviews(Pageable pageable);

    @Modifying
    @Query("delete from Review r where r.id = :reviewId")
    void deleteByReviewId(@Param("reviewId") Long reviewId);

    @Query("SELECT r FROM Review r WHERE r.campsite.id = :campId")
    Page<Review> findByCampId(@Param("campId") Long campId, Pageable pageable);


}