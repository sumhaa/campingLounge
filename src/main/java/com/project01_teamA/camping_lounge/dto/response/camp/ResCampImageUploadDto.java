package com.project01_teamA.camping_lounge.dto.response.camp;

import com.project01_teamA.camping_lounge.entity.camp.CampImageFiles;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResCampImageUploadDto {
    private Long id;
    private String originalFileName;
    private String filePath;
    private String fileType;

    @Builder
    public ResCampImageUploadDto(Long id, String originalFileName, String filePath, String fileType) {
        this.id = id;
        this.originalFileName = originalFileName;
        this.filePath = filePath;
        this.fileType = fileType;
    }

    public static ResCampImageUploadDto fromEntity(CampImageFiles images){
        return ResCampImageUploadDto.builder()
                .id(images.getId())
                .originalFileName(images.getOriginalFileName())
                .filePath(images.getFilePath())
                .fileType(images.getFileType())
                .build();
    }
}
