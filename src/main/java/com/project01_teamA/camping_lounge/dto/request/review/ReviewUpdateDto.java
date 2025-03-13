package com.project01_teamA.camping_lounge.dto.request.review;

import com.project01_teamA.camping_lounge.entity.Review;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReviewUpdateDto {
    private String reviewTitle;
    private String reviewContent;
    private Integer reviewSatisfaction;
    private Integer reviewSize;
    private Integer reviewClean;
    private Integer reviewKindness;

    @Builder
    public ReviewUpdateDto(String reviewTitle, String reviewContent, Integer reviewSatisfaction, Integer reviewSize, Integer reviewClean, Integer reviewKindness) {
        this.reviewTitle = reviewTitle;
        this.reviewContent = reviewContent;
        this.reviewSatisfaction = reviewSatisfaction;
        this.reviewSize = reviewSize;
        this.reviewClean = reviewClean;
        this.reviewKindness = reviewKindness;
    }

    public static ReviewUpdateDto fromEntity(Review review){
        return ReviewUpdateDto.builder()
                .reviewTitle(review.getReviewTitle())
                .reviewContent(review.getReviewContent())
                .reviewSatisfaction(review.getReviewSatisfaction())
                .reviewSize(review.getReviewSize())
                .reviewClean(review.getReviewClean())
                .reviewKindness(review.getReviewKindness())
                .build();
    }
}
