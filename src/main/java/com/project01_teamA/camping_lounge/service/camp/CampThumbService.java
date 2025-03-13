package com.project01_teamA.camping_lounge.service.camp;

import com.project01_teamA.camping_lounge.dto.response.camp.ResCampThumbUploadDto;
import com.project01_teamA.camping_lounge.entity.camp.CampThumbFiles;
import com.project01_teamA.camping_lounge.entity.camp.Campsite;
import com.project01_teamA.camping_lounge.exception.ResourceNotFoundException;
import com.project01_teamA.camping_lounge.repository.camp.CampRepository;
import com.project01_teamA.camping_lounge.repository.camp.CampThumbRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CampThumbService {
    private final CampRepository campRepository;
    private final CampThumbRepository campThumbRepository;

    @Value("${project.camp.folderPath}")
    private String FOLDER_PATH;
    private String SRC = "/images/camp/";

    public List<ResCampThumbUploadDto> upload(Long campId, List<MultipartFile> multipartFiles) throws IOException {
        Campsite camp = campRepository.findById(campId).orElseThrow(
                () -> new ResourceNotFoundException("Campsite", "Camp Id", String.valueOf(campId))
        );
        List<CampThumbFiles> thumb = new ArrayList<>();
        for (MultipartFile multipartFile : multipartFiles) {
            String fileName = multipartFile.getOriginalFilename();
            String randomId = UUID.randomUUID().toString();
            String filePath =
                     "POST_THUMB_" + camp.getId() + "_" + randomId.concat(fileName.substring(fileName.indexOf(".")));

            String fileResourcePath = FOLDER_PATH + File.separator + filePath;

            File f = new File(FOLDER_PATH);
            if (!f.exists()) {
                f.mkdirs();
            }

            Files.copy(multipartFile.getInputStream(), Paths.get(fileResourcePath));
            CampThumbFiles saveThumb = CampThumbFiles.builder()
                    .originalFileName(multipartFile.getOriginalFilename())
                    .filePath(SRC + filePath)
                    .fileType(multipartFile.getContentType())
                    .build();
            saveThumb.setMappingCamp(camp);
            thumb.add(campThumbRepository.save(saveThumb));
        }
        List<ResCampThumbUploadDto> dtos = thumb.stream()
                .map(ResCampThumbUploadDto::fromEntity)
                .collect(Collectors.toList());
        return dtos;
    }

    public void delete(Long thumbId){
        CampThumbFiles thumb = campThumbRepository.findById(thumbId).orElseThrow(
                () -> new ResourceNotFoundException("CampThumb", "Thumb Id", String.valueOf(thumbId))
        );
        String filePath = FOLDER_PATH + File.separator + thumb.getFilePath();
        File file = new File(filePath);
        if (file.exists()) {
            file.delete();
        }
        campThumbRepository.delete(thumb);
    }
}
