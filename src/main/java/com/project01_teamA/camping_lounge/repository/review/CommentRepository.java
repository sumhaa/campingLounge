package com.project01_teamA.camping_lounge.repository.review;

import com.project01_teamA.camping_lounge.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("SELECT c FROM Comment c JOIN c.review r WHERE r.reviewId = :reviewId")
    Page<Comment> findAllReview(Pageable pageable, @Param("reviewId") Long reviewId); // @Param 추가!

//    @Transactional
//    @Modifying
//    @Query("DELETE FROM Comment c WHERE c.review.reviewId = :reviewId")
//    void deleteByReviewId(@Param("reviewId") Long reviewId);

    @Modifying
    @Query("delete from Comment c where c.review.id = :reviewId")
    void deleteByReviewId(@Param("reviewId") Long reviewId);

    @Query("SELECT c FROM Comment c WHERE c.member.id = :memberId")
    Page<Comment> findAllCommentsByMemberId(Pageable pageable, @Param("memberId") Long memberId);
}
