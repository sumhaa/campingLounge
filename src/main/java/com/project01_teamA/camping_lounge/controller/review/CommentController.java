package com.project01_teamA.camping_lounge.controller.review;

import com.project01_teamA.camping_lounge.dto.request.review.CommentWriteDto;
import com.project01_teamA.camping_lounge.dto.response.review.ResCommentDto;
import com.project01_teamA.camping_lounge.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
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
public class CommentController {

    private final CommentService commentService;

    // Comment All List
    @GetMapping("/comments/list")
    public ResponseEntity<Page<ResCommentDto>> commentList(
            @RequestParam Long memberId,
            @PageableDefault(size = 5, sort = "id", direction = Sort.Direction.DESC) Pageable pageable){
        Page<ResCommentDto> commentAllList = commentService.getAllComments(pageable, memberId);
        return ResponseEntity.status(HttpStatus.OK).body(commentAllList);
    }

    // Comment list
    @GetMapping("/{reviewId}/comments/list")
    public ResponseEntity<Page<ResCommentDto>> allCommentList(
            @PathVariable Long reviewId,
            @PageableDefault(size = 5, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ResCommentDto> commentList = commentService.getComments(pageable, reviewId);
        return ResponseEntity.status(HttpStatus.OK).body(commentList);
    }

    // comment write
    @PostMapping("/{reviewId}/comments/write")
    public ResponseEntity<CommentWriteDto> commentWrite(@RequestBody CommentWriteDto commentWriteDto) {
        CommentWriteDto saveCommentDTO = commentService.writeComments(commentWriteDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saveCommentDTO);
    }

    // comment delete
    @DeleteMapping("/{reviewId}/comments/delete/{commentId}")
    public ResponseEntity<Long> delete(@PathVariable Long commentId) {
        commentService.deleteComments(commentId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}