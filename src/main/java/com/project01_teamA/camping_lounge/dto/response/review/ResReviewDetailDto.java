package com.project01_teamA.camping_lounge.dto.response.review;

import com.project01_teamA.camping_lounge.dto.response.camp.ResCampThumbUploadDto;
import com.project01_teamA.camping_lounge.entity.Review;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class ResReviewDetailDto {
    private Long reviewId;
    private Long memberId;
    private String memberName;
    private Long campId;
    private String campName;
    private String campLocation;
    private String resDate;
    private String reviewTitle;
    private String reviewContent;
    private Integer reviewHit;
    private Integer reviewLikes;
    private Integer reviewSatisfaction;
    private Integer reviewSize;
    private Integer reviewClean;
    private Integer reviewKindness;
    private List<ResReviewFileUploadDto> reviewImages;
    private List<ResCommentDto> comment;
    private String createdDate;
    private String modifiedDate;
    private List<ResCampThumbUploadDto> campThumb;

    @Builder
    public ResReviewDetailDto(Long reviewId, Long memberId, String memberName, Long campId, String campName, String reviewTitle, String reviewContent, Integer reviewHit, Integer reviewLikes, Integer reviewSatisfaction, Integer reviewSize, Integer reviewClean, Integer reviewKindness, List<ResReviewFileUploadDto> reviewImages, List<ResCommentDto> comment,String createdDate, String modifiedDate, String campLocation, String resDate, List<ResCampThumbUploadDto> campThumb) {
        this.reviewId = reviewId;
        this.memberId = memberId;
        this.memberName = memberName;
        this.campId = campId;
        this.campName = campName;
        this.campLocation = campLocation;
        this.reviewTitle = reviewTitle;
        this.reviewContent = reviewContent;
        this.reviewHit = reviewHit;
        this.reviewLikes = reviewLikes;
        this.reviewSatisfaction = reviewSatisfaction;
        this.reviewSize = reviewSize;
        this.reviewClean = reviewClean;
        this.reviewKindness = reviewKindness;
        this.reviewImages = reviewImages;
        this.comment = comment;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
        this.resDate = resDate;
        this.campThumb = campThumb;

    }

    public static ResReviewDetailDto fromEntity (Review review){
        return ResReviewDetailDto.builder()
                .reviewId(review.getReviewId())
                .memberId(review.getMember().getId())
                .memberName(review.getMember().getName())
                .campId(review.getCampsite().getId())
                .campName(review.getCampsite().getCampName())
                .campLocation(review.getCampsite().getCampAddress1())
                .campThumb(review.getCampsite().getThumb().stream()
                        .map(ResCampThumbUploadDto::fromEntity)
                        .collect(Collectors.toList())
                )
                .resDate(review.getReservation().getUsageDate().toString())
                .reviewTitle(review.getReviewTitle())
                .reviewContent(review.getReviewContent())
                .reviewHit(review.getReviewHit())
                .reviewLikes(review.getReviewLike())
                .reviewSatisfaction(review.getReviewSatisfaction())
                .reviewSize(review.getReviewSize())
                .reviewClean(review.getReviewClean())
                .reviewKindness(review.getReviewKindness())
                .comment(review.getComment().stream()
                        .map(ResCommentDto::fromEntity)
                        .collect(Collectors.toList()))
                .reviewImages(review.getReviewImages().stream()
                        .map(ResReviewFileUploadDto::fromEntity)
                        .collect(Collectors.toList()))
                .createdDate(review.getCreatedDate())
                .modifiedDate(review.getModifiedDate())
                .build();
    }
}
