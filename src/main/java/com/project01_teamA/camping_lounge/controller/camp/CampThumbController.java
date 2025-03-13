package com.project01_teamA.camping_lounge.controller.camp;

import com.project01_teamA.camping_lounge.dto.response.camp.ResCampThumbUploadDto;
import com.project01_teamA.camping_lounge.service.camp.CampThumbService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/admin/camp/{campId}/thumb")
@RequiredArgsConstructor
public class CampThumbController {

    private final CampThumbService campThumbService;

    @PostMapping("/upload")
    public ResponseEntity<List<ResCampThumbUploadDto>> upload (
            @PathVariable Long campId,
            @RequestParam("thumb") List<MultipartFile> thumb) throws IOException {
        List<ResCampThumbUploadDto> saveThumb = campThumbService.upload(campId, thumb);
        return ResponseEntity.status(HttpStatus.CREATED).body(saveThumb);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Long> delete (
            @RequestParam("thumbId") Long thumbId
    ){
        campThumbService.delete(thumbId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
