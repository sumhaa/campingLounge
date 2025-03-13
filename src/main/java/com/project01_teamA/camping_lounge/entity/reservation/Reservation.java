package com.project01_teamA.camping_lounge.entity.reservation;

import com.project01_teamA.camping_lounge.entity.BaseTimeEntity;
import com.project01_teamA.camping_lounge.entity.Member;
import com.project01_teamA.camping_lounge.entity.camp.Campsite;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Reservation extends BaseTimeEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="RES_ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    @Column(name="MEMBER_EMAIL")
    private String memberEmail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CAMP_ID")
    private Campsite camp;

    @Column(name="CAMP_NAME")
    private String campName;

    @Column(name="RES_DATE")
    private Date reservationDate;

    @Column(name="USAGE_DATE")
    private Date usageDate;

    @Builder
    public Reservation(Long id, Member member, String memberEmail, Campsite camp, String campName, Date reservationDate, Date usageDate) {
        this.id = id;
        this.member = member;
        this.memberEmail = memberEmail;
        this.camp = camp;
        this.campName = campName;
        this.reservationDate = reservationDate;
        this.usageDate = usageDate;
    }
}
