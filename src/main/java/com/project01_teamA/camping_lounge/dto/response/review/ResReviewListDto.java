package com.project01_teamA.camping_lounge.dto.response.review;

import com.project01_teamA.camping_lounge.entity.Review;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class ResReviewListDto {
    private Long reviewId;
    private String reviewTitle;
    private String reviewContent;
    private String createdDate;
    private List<ResReviewFileUploadDto> reviewImages;
    private Integer reviewHit;
    private Long memberId;
    private String campName;

    @Builder
    public ResReviewListDto(String campName, Long memberId, Long reviewId, String reviewTitle, String reviewContent, String createdDate, List<ResReviewFileUploadDto> reviewImages, int reviewHit) {
        this.reviewId = reviewId;
        this.reviewTitle = reviewTitle;
        this.reviewContent = reviewContent;
        this.createdDate = createdDate;
        this.reviewImages = reviewImages;
        this.reviewHit = reviewHit;
        this.memberId = memberId;
        this.campName = campName;
    }

    public static ResReviewListDto fromEntity (Review review){
        return ResReviewListDto.builder()
                .reviewId(review.getReviewId())
                .reviewTitle(review.getReviewTitle())
                .reviewContent(review.getReviewContent())
                .createdDate(review.getCreatedDate())
                .reviewImages(review.getReviewImages().stream()
                        .map(ResReviewFileUploadDto::fromEntity)
                        .collect(Collectors.toList()))
                .reviewHit(review.getReviewHit())
                .memberId(review.getMember().getId())
                .campName(review.getCampsite().getCampName())
                .build();
    }
}
