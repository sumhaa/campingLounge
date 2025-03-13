package com.project01_teamA.camping_lounge.controller.review;

import com.project01_teamA.camping_lounge.dto.request.review.ReviewUpdateDto;
import com.project01_teamA.camping_lounge.dto.request.review.ReviewWriteDto;
import com.project01_teamA.camping_lounge.dto.response.review.ResReviewDetailDto;
import com.project01_teamA.camping_lounge.dto.response.review.ResReviewListDto;
import com.project01_teamA.camping_lounge.dto.response.review.ResReviewWriteDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/review")
@Slf4j
public class ReviewController {

    private final com.project01_teamA.camping_lounge.service.reviewService.ReviewService reviewService;

    // Review List
    @GetMapping("/list")
    public ResponseEntity<Page<ResReviewListDto>> reviewList(
            @PageableDefault(size = 9, sort = "reviewId", direction = Sort.Direction.DESC)Pageable pageable){
        Page<ResReviewListDto> reviewListDtos = reviewService.getAllReviews(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(reviewListDtos);
    }

    // Review Write (Post)
    @PostMapping("/post")
    public ResponseEntity<ResReviewWriteDto> reviewWrite(@RequestBody ReviewWriteDto reviewWriteDto) {
        log.info("리뷰 작성 요청: {}", reviewWriteDto);
        ResReviewWriteDto savedReviewDto = reviewService.writeReviews(reviewWriteDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReviewDto);
    }

    // Review Detail
    @GetMapping("/{reviewId}")
    public ResponseEntity<ResReviewDetailDto> reviewDetail(@PathVariable("reviewId") Long reviewId){
        ResReviewDetailDto resReviewDetailDto = reviewService.detailReviews(reviewId);
        return ResponseEntity.ok(resReviewDetailDto);
    }

    // Review Update
    @PostMapping("/{reviewId}/update")
    public ResponseEntity<ResReviewDetailDto> reviewUpdate(@PathVariable Long reviewId,
                                                           @RequestBody ReviewUpdateDto reviewUpdateDto){
        ResReviewDetailDto resReviewDetailDto = reviewService.updateReviews(reviewId, reviewUpdateDto);
        return ResponseEntity.status(HttpStatus.OK).body(resReviewDetailDto);
    }


    // Review Delete
    @DeleteMapping("/{reviewId}/delete")
    public ResponseEntity<Long> delete(@PathVariable Long reviewId){
        reviewService.deleteReviews(reviewId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    // 베스트 리뷰 조회
    @GetMapping("/best")
    public ResponseEntity<Page<ResReviewListDto>> getBestReviews(
            @RequestParam("page") int page,
            @RequestParam("size") int size) {

        Pageable pageable = PageRequest.of(page, size);  // Pageable 객체 생성
        Page<ResReviewListDto> bestReviews = reviewService.getBestReviews(pageable);
        return ResponseEntity.ok(bestReviews);
    }

    // 좋아요 증가
    @GetMapping("/uplike")
    public void upLikeCount(@RequestParam Long reviewId) {
        ResReviewDetailDto findReviewDto = reviewService.upLikeCount(reviewId);
    }

    // 좋아요 감소
    @GetMapping("/downlike")
    public void downLikeCount(@RequestParam Long reviewId) {
        ResReviewDetailDto findReviewDto = reviewService.downLikeCount(reviewId);
    }

}
