package com.project01_teamA.camping_lounge.repository;

import com.project01_teamA.camping_lounge.entity.ReviewSurvey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewSurveyRepository extends JpaRepository<ReviewSurvey, Long>{
    Optional<ReviewSurvey> findByReview_ReviewId(Long reviewId);
}
