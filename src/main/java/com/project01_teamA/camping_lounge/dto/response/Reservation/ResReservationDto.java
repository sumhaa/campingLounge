package com.project01_teamA.camping_lounge.dto.response.Reservation;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.project01_teamA.camping_lounge.entity.Member;
import com.project01_teamA.camping_lounge.entity.camp.Campsite;
import com.project01_teamA.camping_lounge.entity.reservation.Reservation;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"member", "campsite"})
public class ResReservationDto {
    private Long id;
    private Long memberId;
    private Long campId;
    private String memberEmail;
    private String campName;
    private Date reservationDate;
    private Date usageDate;

    @Builder
    public ResReservationDto(Long id, Long memberId, Long campId, String memberEmail, String campName, Date reservationDate, Date usageDate) {
        this.id = id;
        this.memberId = memberId;
        this.campId = campId;
        this.memberEmail = memberEmail;
        this.campName = campName;
        this.reservationDate = reservationDate;
        this.usageDate = usageDate;
    }

    public static ResReservationDto fromEntity(Reservation reservationes) {
        return ResReservationDto.builder()
                .id(reservationes.getId())
                .memberId(reservationes.getMember().getId())
                .memberEmail(reservationes.getMemberEmail())
                .campId(reservationes.getCamp().getId())
                .campName(reservationes.getCampName())
                .reservationDate(reservationes.getReservationDate())
                .usageDate(reservationes.getUsageDate())
                .build();
    }
}
