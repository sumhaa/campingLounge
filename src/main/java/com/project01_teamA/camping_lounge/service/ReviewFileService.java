package com.project01_teamA.camping_lounge.service.service;

import com.project01_teamA.camping_lounge.dto.request.review.ReviewFileUploadDto;
import com.project01_teamA.camping_lounge.entity.Review;
import com.project01_teamA.camping_lounge.entity.ReviewFiles;
import com.project01_teamA.camping_lounge.exception.ResourceNotFoundException;
import com.project01_teamA.camping_lounge.repository.review.ReviewFileRepository;
import com.project01_teamA.camping_lounge.repository.review.ReviewRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ReviewFileService {

    private final ReviewRepository reviewRepository;
    private final ReviewFileRepository reviewFileRepository;

    @Value("${project.review.folderPath}")
    private String FOLDER_PATH;
    private String SRC = "/images/review/";


    public List<ReviewFileUploadDto> uploadFile(Long reviewId, List<MultipartFile> files) throws IOException {
        Review review = reviewRepository.findById(reviewId).orElseThrow(
                () -> new RuntimeException("Review not found"));

        List<ReviewFileUploadDto> fileUploadDTOList = new ArrayList<>();

        for (MultipartFile file : files) {
            String originFileName = file.getOriginalFilename();
            if (originFileName == null || !originFileName.contains(".")) {
                throw new IllegalArgumentException("Invalid file type");
            }
            String randomId = UUID.randomUUID().toString();
            String storedFileName = randomId + originFileName.substring(originFileName.lastIndexOf("."));

            String filePath = FOLDER_PATH + File.separator + storedFileName;

            File f = new File(FOLDER_PATH);
            if (!f.exists()) {
                f.mkdirs();
            }

            Files.copy(file.getInputStream(), Paths.get(filePath));

            String fileType = file.getContentType();

            ReviewFiles reviewFile = new ReviewFiles();
            reviewFile.setReview(review);
            reviewFile.setOriginFileName(originFileName);
            reviewFile.setFilePath(SRC + storedFileName);
            reviewFile.setFileType(fileType);

            ReviewFiles savedFile = reviewFileRepository.save(reviewFile);

            fileUploadDTOList.add(ReviewFileUploadDto.fromEntity(savedFile));
        }

        return fileUploadDTOList;

    }

    public void delete (Long reviewFilesId){
        ReviewFiles files = reviewFileRepository.findById(reviewFilesId)
                .orElseThrow( ()-> new ResourceNotFoundException("ReviewFiles", "reviewFilesId", String.valueOf(reviewFilesId)));
        String filePath = FOLDER_PATH + File.separator + files.getFilePath();
        File file = new File(filePath);
        if (file.exists()) {
            file.delete();
        }
        reviewFileRepository.delete(files);
    }

    public ReviewFiles getReviewFileById(Long reviewFilesId) {
        return reviewFileRepository.findById(reviewFilesId)
                .orElseThrow(() -> new ResourceNotFoundException("ReviewFile", "reviewFilesId", String.valueOf(reviewFilesId)));
    }
}