package com.project01_teamA.camping_lounge.service.reservation;

import com.project01_teamA.camping_lounge.dto.request.Reservation.ReservationDto;
import com.project01_teamA.camping_lounge.dto.response.Reservation.ResReservationDto;
import com.project01_teamA.camping_lounge.entity.Member;
import com.project01_teamA.camping_lounge.entity.camp.Campsite;
import com.project01_teamA.camping_lounge.entity.reservation.Reservation;
import com.project01_teamA.camping_lounge.repository.MemberRepository;
import com.project01_teamA.camping_lounge.repository.camp.CampRepository;
import com.project01_teamA.camping_lounge.repository.reservation.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final MemberRepository memberRepository;
    private final CampRepository campRepository;

    public ResReservationDto newRes(ReservationDto dto){
        Member member = memberRepository.findByEmail(dto.getMemberEmail())
                .orElseThrow(() -> new RuntimeException("회원 정보를 찾을 수 없습니다."));

        Campsite campsite = campRepository.findById(dto.getCampId())
                .orElseThrow(() -> new RuntimeException("캠핑장 정보를 찾을 수 없습니다."));

        Reservation reservation = new Reservation();
        reservation.setMember(member);
        reservation.setMemberEmail(dto.getMemberEmail());
        reservation.setCamp(campsite);
        reservation.setCampName(dto.getCampName());
        reservation.setReservationDate(dto.getReservationDate());
        reservation.setUsageDate(dto.getUsageDate());

        Reservation savedReservation = reservationRepository.save(reservation);

        return ResReservationDto.fromEntity(savedReservation);
    }

    public void delete(Long resId) {
        reservationRepository.deleteById(resId);
    }

    public Page<ResReservationDto> getAllResByMember(Long memberId, Pageable pageable) {
        Page<Reservation> res = reservationRepository.findAllByMemberId(memberId,pageable);
        List<ResReservationDto> list = res.getContent().stream()
                .map(ResReservationDto::fromEntity)
                .collect(Collectors.toList());
        return new PageImpl<>(list, pageable, res.getTotalElements());
    }

    public Page<ResReservationDto> getAllReservations(Pageable pageable) {
        Page<Reservation> res = reservationRepository.findAll(pageable);
        List<ResReservationDto> list = res.getContent().stream()
                .map(ResReservationDto::fromEntity)
                .collect(Collectors.toList());
        return new PageImpl<>(list, pageable, res.getTotalElements());
    }
}
