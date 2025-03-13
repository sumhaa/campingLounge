package com.project01_teamA.camping_lounge.entity.camp;

import com.project01_teamA.camping_lounge.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Campsite extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="CAMP_ID")
    private Long id;

    @Column(nullable = false, name = "CAMP_NAME")
    private String campName;

    @Column(nullable = false, name = "CAMP_INFO", columnDefinition = "TEXT")
    private String campInfo;

    @Column(nullable = false, name = "CAMP_TEL")
    private String campTel;

    @Column(nullable = false, name = "CAMP_ADDRESS_DO")
    private String campAddressDo;

    @Column(nullable = false, name = "CAMP_ADDRESS_GUNGU")
    private String campAddressGungu;

    @Column(nullable = false, name = "CAMP_ADDRESS_1")
    private String campAddress1;

    @Column(nullable = false, name = "CAMP_ADDRESS_2")
    private String campAddress2;

    @Column(nullable = false, name = "CAMP_MAP_X")
    private String campMapX;

    @Column(nullable = false, name = "CAMP_MAP_Y")
    private String campMapY;

    @Column(nullable = false, name = "TOILET")
    private Integer toilet;

    @Column(nullable = false, name = "HOTWATER")
    private Boolean hotWater;

    @Column(nullable = false, name = "ELECTRIC")
    private Boolean electric;

    @Column(nullable = false, name = "FIREWOOD")
    private Boolean fireWood;

    @Column(nullable = false, name = "WIFI")
    private Boolean wifi;

    @Column(nullable = false, name = "PLAYGROUND")
    private Boolean playGround;

    @Column(nullable = false, name = "PET")
    private Boolean pet;

    @Column(nullable = false, name = "SWIMMING")
    private Boolean swimming;

    @Column(nullable = false, name = "CAMP_TOTAL_CAPACITY")
    private Integer totalCapacity;

    @Column(name = "CAMP_HIT")
    private Integer campHit;

    @Column(name = "CAMP_LIKE")
    private Integer campLike;

    @Column(name = "API_CONTENT_ID")
    private String apiContentId;

    @OneToMany(mappedBy = "campsite", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @BatchSize(size = 10)
    private List<CampThumbFiles> thumb  = new ArrayList<>();

    @OneToMany(mappedBy = "campsite", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @BatchSize(size = 10)
    private List<CampImageFiles> images = new ArrayList<>();

    @Builder
    public Campsite(Long id, String campName, String campInfo, String campTel, String campAddressDo, String campAddressGungu, String campAddress1, String campAddress2, String campMapX, String campMapY, Integer toilet, Boolean hotWater, Boolean electric, Boolean fireWood, Boolean wifi, Boolean playGround, Boolean pet, Boolean swimming, Integer totalCapacity, Integer campHit, Integer campLike, List<CampThumbFiles> thumb, List<CampImageFiles> images, String apiContentId) {
        this.id = id;
        this.campName = campName;
        this.campInfo = campInfo;
        this.campTel = campTel;
        this.campAddressDo = campAddressDo;
        this.campAddressGungu = campAddressGungu;
        this.campAddress1 = campAddress1;
        this.campAddress2 = campAddress2;
        this.campMapX = campMapX;
        this.campMapY = campMapY;
        this.toilet = toilet;
        this.hotWater = hotWater;
        this.electric = electric;
        this.fireWood = fireWood;
        this.wifi = wifi;
        this.playGround = playGround;
        this.pet = pet;
        this.swimming = swimming;
        this.totalCapacity = totalCapacity;
        this.campHit = campHit;
        this.campLike = campLike;
        this.thumb = thumb;
        this.images = images;
        this.apiContentId = apiContentId;
    }
    //조회수 증가
    public synchronized void upViewCount() {
        this.campHit++;
    }

    //좋아요 증가
    public synchronized void upLikeCount() {
        this.campLike++;
    }

    //좋아요 감소
    public synchronized void downLikeCount() {
        this.campLike--;
    }

    //캠핑장 수정
    public void update(String campName, String campInfo, String campTel, String campAddressDo, String campAddressGungu, String campAddress1, String campAddress2, String campMapX, String campMapY, Integer toilet, Boolean hotWater, Boolean electric, Boolean fireWood, Boolean wifi, Boolean playGround, Boolean pet, Boolean swimming, Integer totalCapacity) {
        this.campName = campName;
        this.campInfo = campInfo;
        this.campTel = campTel;
        this.campAddressDo = campAddressDo;
        this.campAddressGungu = campAddressGungu;
        this.campAddress1 = campAddress1;
        this.campAddress2 = campAddress2;
        this.campMapX = campMapX;
        this.campMapY = campMapY;
        this.toilet = toilet;
        this.hotWater = hotWater;
        this.electric = electric;
        this.fireWood = fireWood;
        this.wifi = wifi;
        this.playGround = playGround;
        this.pet = pet;
        this.swimming = swimming;
        this.totalCapacity = totalCapacity;
    }
}
