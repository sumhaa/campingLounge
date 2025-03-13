package com.project01_teamA.camping_lounge.repository.review;

import com.project01_teamA.camping_lounge.entity.ReviewFiles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewFileRepository extends JpaRepository<ReviewFiles, Long> {
//    @Transactional
//    @Modifying
//    @Query("DELETE FROM ReviewFiles f WHERE f.review.reviewId = :reviewId")
//    void deleteByReviewId(Long reviewId);

    @Modifying
    @Query("delete from ReviewFiles rf where rf.review.id = :reviewId")
    void deleteByReviewId(@Param("reviewId") Long reviewId);
}
