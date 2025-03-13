package com.project01_teamA.camping_lounge.dto.response.camp;

import com.project01_teamA.camping_lounge.entity.camp.CampThumbFiles;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResCampThumbUploadDto {
    private Long id;
    private String originalFileName;
    private String filePath;
    private String fileType;

    @Builder
    public ResCampThumbUploadDto(Long id, String originalFileName, String filePath, String fileType) {
        this.id = id;
        this.originalFileName = originalFileName;
        this.filePath = filePath;
        this.fileType = fileType;
    }

    public static ResCampThumbUploadDto fromEntity(CampThumbFiles thumb){
        return ResCampThumbUploadDto.builder()
                .id(thumb.getId())
                .originalFileName(thumb.getOriginalFileName())
                .filePath(thumb.getFilePath())
                .fileType(thumb.getFileType())
                .build();
    }
}
