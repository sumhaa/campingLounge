package com.project01_teamA.camping_lounge.service.camp;

import com.project01_teamA.camping_lounge.dto.response.camp.ResCampImageUploadDto;
import com.project01_teamA.camping_lounge.entity.camp.CampImageFiles;
import com.project01_teamA.camping_lounge.entity.camp.Campsite;
import com.project01_teamA.camping_lounge.exception.ResourceNotFoundException;
import com.project01_teamA.camping_lounge.repository.camp.CampImagesRepository;
import com.project01_teamA.camping_lounge.repository.camp.CampRepository;
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
public class CampImagesService {
    private final CampRepository campRepository;
    private final CampImagesRepository campImagesRepository;

    @Value("${project.camp.folderPath}")
    private String FOLDER_PATH;
    private String SRC = "/images/camp/";

    public List<ResCampImageUploadDto> upload (Long CampId, List<MultipartFile> multipartFiles) throws IOException{
        Campsite camp = campRepository.findById(CampId).orElseThrow(
                ()-> new ResourceNotFoundException("Campsite", "Camp Id", String.valueOf(CampId))
        );
        List<CampImageFiles> imageEntities = new ArrayList<>();
        for (MultipartFile multipartFile : multipartFiles) {
            String fileName = multipartFile.getOriginalFilename();
            String randomId = UUID.randomUUID().toString();
            String filePath =
                    "POST_" + camp.getId() + "_" + randomId.concat(fileName.substring(fileName.indexOf(".")));
            String fileResourcePath = FOLDER_PATH + File.separator + filePath;

            File f = new File(FOLDER_PATH);
            if (!f.exists()) {
                f.mkdirs();
            }
            Files.copy(multipartFile.getInputStream(), Paths.get(fileResourcePath));
            CampImageFiles saveImage = CampImageFiles.builder()
                    .originalFileName(multipartFile.getOriginalFilename())
                    .filePath(SRC + filePath)
                    .fileType(multipartFile.getContentType())
                    .build();
            saveImage.setMappingCamp(camp);
            imageEntities.add(campImagesRepository.save(saveImage));
        }
        List<ResCampImageUploadDto> dtos = imageEntities.stream()
                .map(ResCampImageUploadDto::fromEntity)
                .collect(Collectors.toList());
        return dtos;
    }

    public void delete (Long fileId){
        CampImageFiles image = campImagesRepository.findById(fileId).orElseThrow(
                ()-> new ResourceNotFoundException("CampImageFile", "FileId", String.valueOf(fileId))
        );

        String filePath = FOLDER_PATH + File.separator + image.getFilePath();
        File file = new File(filePath);
        if (file.exists()) {
            file.delete();
        }
        campImagesRepository.delete(image);
    }
}
