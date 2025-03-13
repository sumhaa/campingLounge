package com.project01_teamA.camping_lounge.dto.response.review;

import com.project01_teamA.camping_lounge.entity.ReviewFiles;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ResReviewFileUploadDto {
    private Long reviewFilesId;
    private String originFileName;
    private String fileType;
    private String filePath;

    @Builder
    public ResReviewFileUploadDto(Long reviewFilesId, String originFileName, String fileType, String filePath) {
        this.reviewFilesId = reviewFilesId;
        this.originFileName = originFileName;
        this.fileType = fileType;
        this.filePath = filePath;
    }

    public static ResReviewFileUploadDto fromEntity(ReviewFiles reviewFiles){
        return ResReviewFileUploadDto.builder()
                .reviewFilesId(reviewFiles.getReviewFilesId())
                .originFileName(reviewFiles.getOriginFileName())
                .fileType(reviewFiles.getFileType())
                .filePath(reviewFiles.getFilePath())
                .build();
    }
}
