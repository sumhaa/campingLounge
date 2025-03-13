package com.project01_teamA.camping_lounge.repository.review;

import com.project01_teamA.camping_lounge.entity.ReviewPopularity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewPopularityRepository extends JpaRepository<ReviewPopularity, Long> {
//    @Transactional
//    @Modifying
//    @Query("DELETE FROM ReviewPopularity p WHERE p.review.reviewId = :reviewId")
//    void deleteByReviewId(Long reviewId);

    @Modifying
    @Query("delete from ReviewPopularity rp where rp.review.id = :reviewId")
    void deleteByReviewId(@Param("reviewId") Long reviewId);
}
