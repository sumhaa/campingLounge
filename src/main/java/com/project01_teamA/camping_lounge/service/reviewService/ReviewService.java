package com.project01_teamA.camping_lounge.service.reviewService;

import com.project01_teamA.camping_lounge.dto.request.review.ReviewUpdateDto;
import com.project01_teamA.camping_lounge.dto.request.review.ReviewWriteDto;
import com.project01_teamA.camping_lounge.dto.response.review.ResReviewDetailDto;
import com.project01_teamA.camping_lounge.dto.response.review.ResReviewListDto;
import com.project01_teamA.camping_lounge.dto.response.review.ResReviewWriteDto;
import com.project01_teamA.camping_lounge.entity.*;
import com.project01_teamA.camping_lounge.entity.camp.Campsite;
import com.project01_teamA.camping_lounge.entity.reservation.Reservation;
import com.project01_teamA.camping_lounge.exception.ResourceNotFoundException;
import com.project01_teamA.camping_lounge.repository.*;
import com.project01_teamA.camping_lounge.repository.camp.CampRepository;
import com.project01_teamA.camping_lounge.repository.reservation.ReservationRepository;
import com.project01_teamA.camping_lounge.repository.review.CommentRepository;
import com.project01_teamA.camping_lounge.repository.review.ReviewFileRepository;
import com.project01_teamA.camping_lounge.repository.review.ReviewPopularityRepository;
import com.project01_teamA.camping_lounge.repository.review.ReviewRepository;
import io.jsonwebtoken.io.IOException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ReviewPopularityRepository reviewPopularityRepository;
    private final ReviewFileRepository reviewFileRepository;
    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;
    private final ReservationRepository reservationRepository;
    private final CampRepository campRepository;

    // Review List
    public Page<ResReviewListDto> getAllReviews(Pageable pageable){
        Page<Review> page = reviewRepository.findAllWithPopularity(pageable);
        List<ResReviewListDto> list = page.stream().map(ResReviewListDto::fromEntity).toList();
        return new PageImpl<>(list, pageable, page.getTotalElements());
    }

    // Review Write
    public ResReviewWriteDto writeReviews(ReviewWriteDto reviewWriteDto) throws IOException {
        // 멤버 조회
        Member member = memberRepository.findById(reviewWriteDto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        // 캠핑장 조회
        Campsite campsite = campRepository.findById(reviewWriteDto.getCampId())
                .orElseThrow(() -> new IllegalArgumentException("Camp not found"));

        
        // 예약 내역 조회
        Reservation reservation = reservationRepository.findById(reviewWriteDto.getReservationId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 예약입니다."));

        // dto을 엔티티로 변환
        Review review = reviewWriteDto.toEntity(member, campsite, reservation);

        // 리뷰 repository에 저장
        Review savedReview = reviewRepository.save(review);

        return ResReviewWriteDto.fromEntity(savedReview);
    }

    // Review Detail
    public ResReviewDetailDto detailReviews(Long reviewId) {
        // 리뷰 조회
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "Review Id", String.valueOf(reviewId)));

        // 조회수 증가
        review.incrementReviewHit();

        // 댓글 불러오기
        List<Comment> comment = review.getComment();

        return ResReviewDetailDto.fromEntity(review);
    }

    // Review Delete
    public void deleteReviews(Long reviewId){
        // 관련된 파일 삭제
        commentRepository.deleteByReviewId(reviewId);
        reviewPopularityRepository.deleteByReviewId(reviewId);
        reviewFileRepository.deleteByReviewId(reviewId);
        reviewRepository.deleteByReviewId(reviewId);
    }

    // Review Update
    public ResReviewDetailDto updateReviews(Long reviewId, ReviewUpdateDto dto){
        Review updatedReview = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "Review Id", String.valueOf(reviewId)));
        updatedReview.update(dto.getReviewTitle(), dto.getReviewContent(), dto.getReviewSatisfaction(), dto.getReviewSize(), dto.getReviewClean(), dto.getReviewKindness());

        return ResReviewDetailDto.fromEntity(updatedReview);
    }

    public Page<ResReviewListDto> getBestReviews(Pageable pageable) {
        Page<Review> page = reviewRepository.findBestReviews(pageable);
        List<ResReviewListDto> list = page.stream().map(ResReviewListDto::fromEntity).collect(Collectors.toList());
        return new PageImpl<>(list, pageable, page.getTotalElements());
    }

    //어드민용 getAllReview
    public Page<ResReviewDetailDto> getAllReviewsForAdmin(Pageable pageable) {
        Page<Review> page = reviewRepository.findAll(pageable);
        List<ResReviewDetailDto> list = page.getContent().stream()
                .map(ResReviewDetailDto::fromEntity)
                .collect(Collectors.toList());;
        return new PageImpl<>(list, pageable, page.getTotalElements());
    }

    
    // 좋아요 증가
    public ResReviewDetailDto upLikeCount(Long reviewId) {
        Review findReview = reviewRepository.findById(reviewId).orElseThrow(
                () -> new ResourceNotFoundException("Review", "Review Id", String.valueOf(reviewId))
        );
        findReview.upLikeCount();
        return ResReviewDetailDto.fromEntity(findReview);
    }

    // 좋아요 감소
    public ResReviewDetailDto downLikeCount(Long reviewId) {
        Review findReview = reviewRepository.findById(reviewId).orElseThrow(
                () -> new ResourceNotFoundException("Review", "Review Id", String.valueOf(reviewId))
        );
        findReview.downLikeCount();
        return ResReviewDetailDto.fromEntity(findReview);
    }

    public Page<ResReviewListDto> findByCampId(Long campId, Pageable pageable) {
        Page<Review> list = reviewRepository.findByCampId(campId, pageable);
        List<ResReviewListDto> listDto = list.stream().map(ResReviewListDto::fromEntity).collect(Collectors.toList());
        return new PageImpl<>(listDto, pageable, list.getTotalElements());
    }
}