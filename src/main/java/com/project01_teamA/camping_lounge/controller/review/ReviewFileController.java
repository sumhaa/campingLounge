package com.project01_teamA.camping_lounge.controller.review;

import com.project01_teamA.camping_lounge.dto.request.review.ReviewFileUploadDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/review/{reviewId}/image/")
public class ReviewFileController {

    private final com.project01_teamA.camping_lounge.service.service.ReviewFileService reviewFileService;

    @PostMapping("/upload")
    public ResponseEntity<List<ReviewFileUploadDto>> upload (
            @PathVariable Long reviewId,
            @RequestParam("files") List<MultipartFile> files) throws IOException {
        List<ReviewFileUploadDto> saveFile = reviewFileService.uploadFile(reviewId, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(saveFile);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Long> delete(@RequestParam("reviewFilesId") Long reviewFilesId){
        reviewFileService.delete(reviewFilesId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
