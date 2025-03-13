package com.project01_teamA.camping_lounge.controller.camp;

import com.project01_teamA.camping_lounge.dto.response.camp.ResCampImageUploadDto;
import com.project01_teamA.camping_lounge.service.camp.CampImagesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/admin/camp/{campId}/image")
@RequiredArgsConstructor
public class CampImageController {
    private final CampImagesService campImagesService;

    @PostMapping("upload")
    public ResponseEntity<List<ResCampImageUploadDto>> upload (
            @PathVariable Long campId,
            @RequestParam("image") List<MultipartFile> images
    ) throws IOException {
        List<ResCampImageUploadDto> saveImage = campImagesService.upload(campId, images);
        return ResponseEntity.status(HttpStatus.CREATED).body(saveImage);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> delete (
            @RequestParam("imageId") Long imageId
    ){
        campImagesService.delete(imageId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
