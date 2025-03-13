package com.project01_teamA.camping_lounge.dto.request.review;

import com.project01_teamA.camping_lounge.entity.Comment;
import com.project01_teamA.camping_lounge.entity.Member;
import com.project01_teamA.camping_lounge.entity.Review;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommentWriteDto {
    private String commentContent;
    private Long reviewId;
    private Long memberId;

    @Builder
    public CommentWriteDto(String commentContent, Long reviewId, Long memberId) {
        this.commentContent = commentContent;
        this.reviewId = reviewId;
        this.memberId = memberId;
    }

    public static CommentWriteDto fromEntity(Comment comment){
        return CommentWriteDto.builder()
                .commentContent(comment.getCommentContent())
                .reviewId(comment.getReview().getReviewId())
                .memberId(comment.getMember().getId())
                .build();
    }

    public Comment toEntity(Review review, Member member) {
        return Comment.builder()
                .commentContent(this.commentContent)
                .review(review)
                .member(member)
                .build();
    }
}