package com.project01_teamA.camping_lounge.controller;

import com.project01_teamA.camping_lounge.dto.request.member.MemberUpdateDto;
import com.project01_teamA.camping_lounge.dto.response.Reservation.ResReservationDto;
import com.project01_teamA.camping_lounge.dto.response.member.MemberResponseDto;
import com.project01_teamA.camping_lounge.dto.response.review.ResCommentDto;
import com.project01_teamA.camping_lounge.dto.response.review.ResReviewDetailDto;
import com.project01_teamA.camping_lounge.entity.Member;
import com.project01_teamA.camping_lounge.repository.ChatMessageRepository;
import com.project01_teamA.camping_lounge.repository.MemberRepository;
import com.project01_teamA.camping_lounge.repository.camp.CampRepository;
import com.project01_teamA.camping_lounge.repository.reservation.ReservationRepository;
import com.project01_teamA.camping_lounge.repository.review.CommentRepository;
import com.project01_teamA.camping_lounge.repository.review.ReviewRepository;
import com.project01_teamA.camping_lounge.service.CommentService;
import com.project01_teamA.camping_lounge.service.MemberService;
import com.project01_teamA.camping_lounge.service.SecurityKeyService;
import com.project01_teamA.camping_lounge.service.reservation.ReservationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final MemberService memberService;
    private final SecurityKeyService securityKeyService;
    private final MemberRepository memberRepository;
    private final CampRepository campRepository;
    private final ReservationRepository reservationRepository;
    private final ReservationService reservationService;
    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final com.project01_teamA.camping_lounge.service.reviewService.ReviewService reviewService;
    private final CommentService commentService;

    public AdminController(SecurityKeyService securityKeyService, MemberService memberService, MemberRepository memberRepository, CampRepository campRepository, ReservationRepository reservationRepository, ReservationService reservationService, ReviewRepository reviewRepository, CommentRepository commentRepository, ChatMessageRepository chatMessageRepository, com.project01_teamA.camping_lounge.service.reviewService.ReviewService reviewService, CommentService commentService) {
        this.securityKeyService = securityKeyService;
        this.memberService = memberService;
        this.memberRepository = memberRepository;
        this.campRepository = campRepository;
        this.reservationRepository = reservationRepository;
        this.reservationService = reservationService;
        this.reviewRepository = reviewRepository;
        this.commentRepository = commentRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.reviewService = reviewService;
        this.commentService = commentService;
    }

//    @GetMapping("/members")
//    public ResponseEntity<List<Member>> getAllMembers() {
//        List<Member> members = memberService.getAllMembers();
//        return ResponseEntity.status(HttpStatus.OK).body(members);
//    }

    @GetMapping("/members")
    public ResponseEntity<Page<MemberResponseDto>> getAllMembers(
              @PageableDefault(size= 10, sort="id", direction = Sort.Direction.DESC) Pageable pageable) {
        System.out.println("Received sort: " + pageable.getSort());
        Page<MemberResponseDto> listDto = memberService.getAllMembers(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(listDto);
    }

    @DeleteMapping("/delete/{memberId}")
    public ResponseEntity<String> deleteMember(@PathVariable Long memberId) {
        memberService.deleteMember(memberId);
        return ResponseEntity.status(HttpStatus.OK).body("유저 삭제 성공");
    }

    @PutMapping("/update/{memberId}")
    public ResponseEntity<String> updateMember(@PathVariable Long memberId, @RequestBody MemberUpdateDto memberUpdateDto) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));
        memberService.userUpdate(member, memberUpdateDto);
        return ResponseEntity.status(HttpStatus.OK).body("유저 정보 수정 성공");
    }

    @GetMapping("/review")
    public ResponseEntity<Page<ResReviewDetailDto>> getAllReviews(
            @PageableDefault(size= 10, sort="reviewId", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ResReviewDetailDto> listDto = reviewService.getAllReviewsForAdmin(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(listDto);
    }

    @DeleteMapping("/review/{reviewId}/delete")
    public ResponseEntity<String> deleteReview(@PathVariable Long reviewId) {
        reviewService.detailReviews(reviewId);
        return ResponseEntity.status(HttpStatus.OK).body("리뷰 삭제 성공");
    }

    @GetMapping("/comment")
    public ResponseEntity<Page<ResCommentDto>> getAllComments(
            @PageableDefault(size= 10, sort="commentId", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ResCommentDto> listDto = commentService.getAllCommentsForAdmin(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(listDto);
    }

    @DeleteMapping("/comment/{commentId}/delete")
    public ResponseEntity<String> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComments(commentId);
        return ResponseEntity.status(HttpStatus.OK).body("댓글 삭제 성공");
    }


    // 보안키 기능

    @GetMapping("/securityKey")
    public ResponseEntity<String> getSecurityKey() {
        return ResponseEntity.status(HttpStatus.OK).body(securityKeyService.getSecurityKey());
    }

//    @GetMapping("/regenerateKey")
//    public ResponseEntity<String> regenerateKey() {
//        securityKeyService.generateKey();
//        return ResponseEntity.status(HttpStatus.OK).body("Key Regenerated");
//    }

    @GetMapping("/dashboard/member")
    public ResponseEntity<Long> getMemberCount() {
        Long memberCount = memberRepository.count();
        System.out.println("전체 맴버 수" + memberCount);
        return ResponseEntity.status(HttpStatus.OK).body(memberCount);
    }
    @GetMapping("/dashboard/camp")
    public ResponseEntity<Long> getCampSiteCount() {
        Long campCount = campRepository.count();
        System.out.println("전체 캠프 수" + campCount);
        return ResponseEntity.status(HttpStatus.OK).body(campCount);
    }
    @GetMapping("/dashboard/res")
    public ResponseEntity<Long> getReservationCount() {
        Long resCount = reservationRepository.count();
        System.out.println("전체 예약 수" + resCount);
        return ResponseEntity.status(HttpStatus.OK).body(resCount);
    }

    @GetMapping("/dashboard/review")
    public ResponseEntity<Long> getReviewCount() {
        Long reviewCount = reviewRepository.count();
        System.out.println("전체 리뷰 수" + reviewCount);
        return ResponseEntity.status(HttpStatus.OK).body(reviewCount);
    }

    @GetMapping("/dashboard/comment")
    public ResponseEntity<Long> getCommentCount() {
        Long commentCount = commentRepository.count();
        System.out.println("전체 댓글 수" + commentCount);
        return ResponseEntity.status(HttpStatus.OK).body(commentCount);
    }

    @GetMapping("/dashboard/chatting")
    public ResponseEntity<Long> getChattingCount() {
        Long chattingCount = chatMessageRepository.count();
        System.out.println("전체 채팅 수" + chattingCount);
        return ResponseEntity.status(HttpStatus.OK).body(chattingCount);
    }

    @GetMapping("/member/disabled")
    public ResponseEntity<Long> getDisabledMemberCount() {
        Long disabledMemberCount = memberRepository.countByEnableFalse();
        System.out.println("비활성화된 맴버 수: " + disabledMemberCount);
        return ResponseEntity.status(HttpStatus.OK).body(disabledMemberCount);
    }

    @GetMapping("/member/gender")
    public ResponseEntity<Map<String, Long>> getGenderRatio() {
        Long maleCount = memberRepository.countByGender("남자");
        Long femaleCount = memberRepository.countByGender("여자");

        Map<String, Long> genderRatio = new HashMap<>();
        genderRatio.put("male", maleCount);
        genderRatio.put("female", femaleCount);

        System.out.println("남성 회원 수: " + maleCount);
        System.out.println("여성 회원 수: " + femaleCount);

        return ResponseEntity.status(HttpStatus.OK).body(genderRatio);
    }

    //예약 탭
    @GetMapping("/reservation")
    public ResponseEntity<Page<ResReservationDto>> getAllReservations(
            @PageableDefault(size= 10, sort="id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ResReservationDto> listDto = reservationService.getAllReservations(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(listDto);
    }
    
    @DeleteMapping("/reservation/{reservationId}/delete")
    public ResponseEntity<String> deleteReservation(@PathVariable Long reservationId) {
        return ResponseEntity.status(HttpStatus.OK).body("예약 삭제 성공");
    }


}
