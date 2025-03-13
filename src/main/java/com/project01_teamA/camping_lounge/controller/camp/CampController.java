package com.project01_teamA.camping_lounge.controller.camp;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project01_teamA.camping_lounge.dto.request.camp.CampUpdateDto;
import com.project01_teamA.camping_lounge.dto.request.camp.CampWriteDto;
import com.project01_teamA.camping_lounge.dto.response.camp.ResCampDetailDto;
import com.project01_teamA.camping_lounge.dto.response.camp.ResCampListDto;
import com.project01_teamA.camping_lounge.dto.response.camp.ResCampWriteDto;
import com.project01_teamA.camping_lounge.dto.response.review.ResReviewListDto;
import com.project01_teamA.camping_lounge.service.camp.CampService;
import com.project01_teamA.camping_lounge.service.reviewService.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class CampController {
    private final CampService campService;
    private final ReviewService reviewService;

    //전체보기
    @GetMapping("/camp")
    public ResponseEntity<Page<ResCampListDto>> campList(
            @PageableDefault(size = 9, sort = "id", direction = Sort.Direction.DESC)Pageable pageable){
        Page<ResCampListDto> listDto = campService.getAllCamps(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(listDto);
    }
    
    //서치, 필터
    @GetMapping("/camp/search")
    public ResponseEntity<Page<ResCampListDto>> searchCamp(
            @RequestParam(required = false) String search,
            @RequestParam(required = false)List<String> filters,
            @PageableDefault(size = 9, sort = "id", direction = Sort.Direction.DESC)Pageable pageable){
            Page<ResCampListDto> listDto = campService.getFilteredCamps(search, filters, pageable);
            return ResponseEntity.status(HttpStatus.OK).body(listDto);
    }

    //캠핑장 상세
    @GetMapping("/camp/{campId}")
    public ResponseEntity<ResCampDetailDto> detail(@PathVariable("campId") Long campId) {
        ResCampDetailDto findCampDto = campService.detail(campId);
        return ResponseEntity.status(HttpStatus.OK).body(findCampDto);
    }

    @GetMapping("/camp/uplike")
    public void upLikeCount(@RequestParam Long campId) {
        ResCampDetailDto findCampDto = campService.upLikeCount(campId);
    }

    @GetMapping("/camp/downlike")
    public void downLikeCount(@RequestParam Long campId) {
        ResCampDetailDto findCampDto = campService.downLikeCount(campId);
    }

    @GetMapping("camp/{campId}/review")
    public ResponseEntity<Page<ResReviewListDto>> getCampReivew(
            @PathVariable("campId") Long campId,
            @PageableDefault(size = 9, sort = "id", direction = Sort.Direction.DESC)Pageable pageable){
        Page<ResReviewListDto> listDto = reviewService.findByCampId(campId,pageable);
        return ResponseEntity.status(HttpStatus.OK).body(listDto);
    }



    //어드민 페이지 요청
    //캠핑장 등록
    @PostMapping(value = "/admin/camp/write", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ResCampWriteDto> write(
            @RequestPart("campDto") String campDtoJson,
            @RequestPart(value = "thumb", required = false) List<MultipartFile> thumb,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) throws IOException {

        Thread currentThread = Thread.currentThread();
        log.info("현재 실행중인 스레드" + currentThread.getName());
        //제이슨 데이터를 자바 객체로 매핑
        CampWriteDto campDto = new ObjectMapper().readValue(campDtoJson, CampWriteDto.class);

        // DTO에 파일 정보 추가
        campDto.setThumb(thumb);
        campDto.setImages(images);

        ResCampWriteDto saveCampDto = campService.write(campDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saveCampDto);
    }

    @GetMapping(value = "/admin/camp/openapi/{rowNum}")
    public String CampDataFromOpenApi(@PathVariable Long rowNum) {
       campService.CampDataFromOpenApi(rowNum);
       return "고캠핑 공공 API 연동에 성공했습니다.";
    }

    //캠핑장 상세
    @GetMapping("/admin/camp/{campId}")
    public ResponseEntity<ResCampDetailDto> adminCampDetail(@PathVariable("campId") Long campId) {
        ResCampDetailDto findCampDto = campService.detail(campId);
        return ResponseEntity.status(HttpStatus.OK).body(findCampDto);
    }

    // 캠핑장 수정
    @PatchMapping("/admin/camp/{campId}/update")
    public ResponseEntity<ResCampDetailDto> update(
            @PathVariable("campId") Long campId,
            @RequestBody CampUpdateDto campDTO) {
        ResCampDetailDto updateCampdDTO = campService.update(campId, campDTO);
        return ResponseEntity.status(HttpStatus.OK).body(updateCampdDTO);
    }

//    //체크한 캠핑장 삭제
//    @DeleteMapping("/admin/camp/delete")
//    public ResponseEntity<String> deleteCheck (@RequestBody List<Long> campId){
//        campService.deleteChecked(campId);
//        return ResponseEntity.status(HttpStatus.OK).build();
//    }

    // 캠핑장 상세에서 캠핑장 삭제
    @DeleteMapping("/admin/camp/{campId}/delete")
    public ResponseEntity<String> delete (@PathVariable Long campId){
        campService.delete(campId);
        return ResponseEntity.status(HttpStatus.OK).body("캠프 삭제 성공");
    }

}
