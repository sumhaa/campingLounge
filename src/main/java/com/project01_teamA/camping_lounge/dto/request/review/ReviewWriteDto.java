package com.project01_teamA.camping_lounge.dto.request.review;

import com.project01_teamA.camping_lounge.entity.Member;
import com.project01_teamA.camping_lounge.entity.Review;
import com.project01_teamA.camping_lounge.entity.ReviewFiles;
import com.project01_teamA.camping_lounge.entity.camp.Campsite;
import com.project01_teamA.camping_lounge.entity.reservation.Reservation;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class ReviewWriteDto {
    private String reviewTitle;
    private String reviewContent;
    private Integer reviewSatisfaction;
    private Integer reviewSize;
    private Integer reviewClean;
    private Integer reviewKindness;
    private List<ReviewFiles> reviewImages;
    private Long memberId;
    private Long reservationId;
    private Long campId;
    private Integer reviewHit = 0;
    private Integer reviewLike = 0;

    @Builder
    public ReviewWriteDto( String reviewTitle, String reviewContent, Integer reviewSatisfaction, Integer reviewSize, Integer reviewClean, Integer reviewKindness, List<ReviewFiles> reviewImages, Long memberId, Long reservationId, Long campId, Integer reviewHit, Integer reviewLike) {
        this.reviewTitle = reviewTitle;
        this.reviewContent = reviewContent;
        this.reviewSatisfaction = reviewSatisfaction;
        this.reviewSize = reviewSize;
        this.reviewClean = reviewClean;
        this.reviewKindness = reviewKindness;
        this.reviewImages = reviewImages;
        this.memberId = memberId;
        this.reservationId = reservationId;
        this.campId = campId;
        this.reviewHit = reviewHit;
        this.reviewLike = reviewLike;
    }

    public Review toEntity(Member member, Campsite campsite, Reservation reservation) {
        return Review.builder()
                .reviewTitle(this.reviewTitle)
                .reviewContent(this.reviewContent)
                .reviewSatisfaction(this.reviewSatisfaction)
                .reviewSize(this.reviewSize)
                .reviewClean(this.reviewClean)
                .reviewKindness(this.reviewKindness)
                .member(member)
                .campsite(campsite)
                .reservation(reservation)
                .reviewHit(this.reviewHit)
                .reviewLike(this.reviewLike)
                .build();
    }

}
