package com.project01_teamA.camping_lounge.dto.response.review;

import com.project01_teamA.camping_lounge.entity.Review;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
@NoArgsConstructor
public class ResReviewWriteDto {
    private Long reviewId;
    private String reviewTitle;
    private String reviewContent;
    private Integer reviewSatisfaction;
    private Integer reviewSize;
    private Integer reviewClean;
    private Integer reviewKindness;
    private String createdDate;
    private Date usageDate;

    @Builder
    public ResReviewWriteDto(Date usageDate, Long reviewId, String reviewTitle, String reviewContent, Integer reviewSatisfaction, Integer reviewSize, Integer reviewClean, Integer reviewKindness, String createdDate) {
        this.reviewId = reviewId;
        this.reviewTitle = reviewTitle;
        this.reviewContent = reviewContent;
        this.reviewSatisfaction = reviewSatisfaction;
        this.reviewSize = reviewSize;
        this.reviewClean = reviewClean;
        this.reviewKindness = reviewKindness;
        this.createdDate = createdDate;
        this.usageDate = usageDate;
    }

    public static ResReviewWriteDto fromEntity(Review review){
        return  ResReviewWriteDto.builder()
                .reviewId(review.getReviewId())
                .reviewTitle(review.getReviewTitle())
                .reviewContent(review.getReviewContent())
                .reviewSatisfaction(review.getReviewSatisfaction())
                .reviewSize(review.getReviewSize())
                .reviewClean(review.getReviewClean())
                .reviewKindness(review.getReviewKindness())
                .createdDate(review.getCreatedDate())
                .usageDate(review.getReservation().getUsageDate())
                .build();

    }

}
