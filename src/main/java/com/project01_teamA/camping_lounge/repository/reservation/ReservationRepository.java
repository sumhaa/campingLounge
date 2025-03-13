package com.project01_teamA.camping_lounge.repository.reservation;

import com.project01_teamA.camping_lounge.entity.reservation.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query("SELECT r FROM Reservation r WHERE r.member.id = :memberId")
    Page<Reservation> findAllByMemberId(@Param("memberId") Long memberId, Pageable pageable);
}
