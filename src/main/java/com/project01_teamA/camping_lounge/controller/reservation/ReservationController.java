package com.project01_teamA.camping_lounge.controller.reservation;

import com.project01_teamA.camping_lounge.dto.request.Reservation.ReservationDto;
import com.project01_teamA.camping_lounge.dto.response.Reservation.ResReservationDto;
import com.project01_teamA.camping_lounge.entity.Member;
import com.project01_teamA.camping_lounge.service.reservation.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ReservationController {

    private final ReservationService reservationService;

    //예약하기
//    @PostMapping(value = "/camp/{campId}/reservation")
//    public ResponseEntity<ResReservationDto> reservation (
//            @RequestBody ReservationDto resDto) {
//        ResReservationDto dto = reservationService.newRes(resDto);
//        return ResponseEntity.status(HttpStatus.OK).body(dto);
//    }
//    POST http://localhost:8080/camp/15/reservation net::ERR_INCOMPLETE_CHUNKED_ENCODING 200 (OK)
    @PostMapping(value = "/camp/{campId}/reservation")
    public ResponseEntity<?> reservation (@RequestBody ReservationDto resDto) {
        try {
            ResReservationDto dto = reservationService.newRes(resDto);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("예약 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    //내 정보에서 예약 보기
    @GetMapping(value = "/member/{memberId}/reservation")
    public ResponseEntity<Page<ResReservationDto>> getReservation (
            @PathVariable Long memberId,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC)Pageable pageable){
        Page<ResReservationDto> resDto = reservationService.getAllResByMember(memberId,pageable);
        return ResponseEntity.status(HttpStatus.OK).body(resDto);
    }

    //내 정보에서 예약삭제
    @DeleteMapping(value = "/member/{memberId}/reservation/delete/{reservationId}")
    public ResponseEntity<Long> delete (@PathVariable Long reservationId){
        reservationService.delete(reservationId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
