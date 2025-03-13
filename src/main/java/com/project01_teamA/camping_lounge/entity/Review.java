package com.project01_teamA.camping_lounge.entity;

import com.project01_teamA.camping_lounge.entity.camp.Campsite;
import com.project01_teamA.camping_lounge.entity.reservation.Reservation;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Review extends BaseTimeEntity{

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    @Column(name = "review_title", nullable = false)
    private String reviewTitle;

    @Column(name = "review_content", columnDefinition = "LONGTEXT")
    private String reviewContent;

    @Column(name = "review_satisfaction")
    private Integer reviewSatisfaction;

    @Column(name = "review_size")
    private Integer reviewSize;

    @Column(name = "review_clean")
    private Integer reviewClean;

    @Column(name = "review_kindness")
    private Integer reviewKindness;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "pop_id")
    private ReviewPopularity reviewPopularity;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @BatchSize(size = 10)
    private List<ReviewFiles> reviewImages = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 10)
    private List<Comment> comment = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "camp_id")
    private Campsite campsite;

    @ManyToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    @Column(name = "review_hit", columnDefinition = "int default 0")
    private Integer reviewHit;

    @Column(name = "review_like", columnDefinition = "int default 0")
    private Integer reviewLike;

    //조회수 증가
    public synchronized void incrementReviewHit() {
        this.reviewHit++;
    }

    //좋아요 증가
    public synchronized void upLikeCount() {
        this.reviewLike++;
    }
    //좋아요 감소
    public synchronized void downLikeCount() {
        this.reviewLike--;
    }

    @Builder
    public Review(Long reviewId, String reviewTitle, String reviewContent, Integer reviewSatisfaction, Integer reviewSize, Integer reviewClean, Integer reviewKindness, ReviewPopularity reviewPopularity, List<ReviewFiles> reviewImages, Member member, List<Comment> comment, Campsite campsite, Reservation reservation,Integer reviewHit, Integer reviewLike) {
        this.reviewId = reviewId;
        this.reviewTitle = reviewTitle;
        this.reviewContent = reviewContent;
        this.reviewSatisfaction = reviewSatisfaction;
        this.reviewSize = reviewSize;
        this.reviewClean = reviewClean;
        this.reviewKindness = reviewKindness;
        this.reviewPopularity = reviewPopularity;
        this.reviewImages = reviewImages;
        this.member = member;
        this.comment = comment;
        this.campsite = campsite;
        this.reservation = reservation;
        this.reviewHit = reviewHit;
        this.reviewLike = reviewLike;
    }

    // Review update method
    public void update(String reviewTitle, String reviewContent, Integer reviewSatisfaction, Integer reviewSize, Integer reviewClean, Integer reviewKindness) {
      this.reviewTitle = reviewTitle;
      this.reviewContent = reviewContent;
      this.reviewSatisfaction = reviewSatisfaction;
      this.reviewSize = reviewSize;
      this.reviewClean = reviewClean;
      this.reviewKindness = reviewKindness;
    }
}
