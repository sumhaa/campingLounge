package com.project01_teamA.camping_lounge.service;

import com.project01_teamA.camping_lounge.dto.request.review.CommentWriteDto;
import com.project01_teamA.camping_lounge.dto.response.review.ResCommentDto;
import com.project01_teamA.camping_lounge.dto.response.review.ResReviewDetailDto;
import com.project01_teamA.camping_lounge.entity.Comment;
import com.project01_teamA.camping_lounge.entity.Member;
import com.project01_teamA.camping_lounge.entity.Review;
import com.project01_teamA.camping_lounge.exception.ResourceNotFoundException;
import com.project01_teamA.camping_lounge.repository.review.CommentRepository;
import com.project01_teamA.camping_lounge.repository.MemberRepository;
import com.project01_teamA.camping_lounge.repository.review.ReviewRepository;
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
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CommentService {
    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;

    // Comment All list
    public Page<ResCommentDto> getAllComments(Pageable pageable, Long memberId){
        Page<Comment> commentListPage = commentRepository.findAllCommentsByMemberId(pageable, memberId);
        return commentListPage.map(ResCommentDto::fromEntity);
    }

    // Comment list
    public Page<ResCommentDto> getComments(Pageable pageable, Long reviewId) {
        Page<Comment> commentPage = commentRepository.findAllReview(pageable, reviewId);
        return commentPage.map(ResCommentDto::fromEntity);
    }

    // Comment write
    public CommentWriteDto writeComments(CommentWriteDto commentWriteDto){
        Review review = reviewRepository.findById(commentWriteDto.getReviewId())
                .orElseThrow(() -> new ResourceNotFoundException("Review", "Review Id", String.valueOf(commentWriteDto.getReviewId())));

        Member member = memberRepository.findById(commentWriteDto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        Comment comment = commentWriteDto.toEntity(review, member);

        if (member.getId() == null) {  // 새로 생성된 멤버라면
            memberRepository.save(member); // 먼저 멤버 저장
        }
        comment.setMember(member);
        commentRepository.save(comment);
        return commentWriteDto;
    }

    // Comment delete
    public void deleteComments(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    public Page<ResCommentDto> getAllCommentsForAdmin(Pageable pageable) {
        Page<Comment> comment = commentRepository.findAll(pageable);
        List<ResCommentDto> list = comment.getContent().stream()
                .map(ResCommentDto::fromEntity)
                .collect(Collectors.toList());
        return new PageImpl<>(list, pageable, comment.getTotalElements());
    }
}
