package com.project01_teamA.camping_lounge.dto.request.review;

import com.project01_teamA.camping_lounge.entity.ReviewFiles;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReviewFileUploadDto {
    private Long reviewFilesId;
    private String originFileName;
    private String fileType;
    private String filePath;

    @Builder
    public ReviewFileUploadDto(Long reviewFilesId, String originFileName, String fileType, String filePath) {
        this.reviewFilesId = reviewFilesId;
        this.originFileName = originFileName;
        this.fileType = fileType;
        this.filePath = filePath;
    }

    public static ReviewFileUploadDto fromEntity(ReviewFiles reviewFiles){
        return ReviewFileUploadDto.builder()
                .reviewFilesId(reviewFiles.getReviewFilesId())
                .originFileName(reviewFiles.getOriginFileName())
                .fileType(reviewFiles.getFileType())
                .filePath(reviewFiles.getFilePath())
                .build();
    }
}
