package com.project01_teamA.camping_lounge.dto.response.review;

import com.project01_teamA.camping_lounge.entity.Comment;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ResCommentDto {
    private Long commentId;
    private Long reviewId;
    private String commentContent;
    private Long memberId;
    private String memberName;
    private String createdDate;
    private String reviewTitle;

    @Builder
    public ResCommentDto(String reviewTitle, Long commentId, Long reviewId, String commentContent, Long memberId, String memberName, String createdDate) {
        this.commentId = commentId;
        this.reviewId = reviewId;
        this.commentContent = commentContent;
        this.memberId = memberId;
        this.memberName = memberName;
        this.createdDate = createdDate;
        this.reviewTitle = reviewTitle;
    }

    public static ResCommentDto fromEntity(Comment comment){
        return ResCommentDto.builder()
                .commentId(comment.getCommentId())
                .reviewId(comment.getReview().getReviewId())
                .commentContent(comment.getCommentContent())
                .memberId(comment.getMember().getId())
                .memberName(comment.getMember().getName())
                .createdDate(comment.getCreatedDate())
                .reviewTitle(comment.getReview().getReviewTitle())
                .build();
    }
}
