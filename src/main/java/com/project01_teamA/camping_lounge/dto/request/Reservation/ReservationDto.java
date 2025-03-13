package com.project01_teamA.camping_lounge.dto.request.Reservation;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class ReservationDto {
    private Long memberId;
    private String memberEmail;
    private Long campId;
    private String campName;
    private Date reservationDate;
    private Date usageDate;

    @Builder
    public ReservationDto(Long memberId,String memberEmail, Long campId, String campName, Date reservationDate, Date usageDate) {
        this.memberId = memberId;
        this.memberEmail = memberEmail;
        this.campId = campId;
        this.campName = campName;
        this.reservationDate = reservationDate;
        this.usageDate = usageDate;
    }
}
