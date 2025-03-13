package com.project01_teamA.camping_lounge.dto.response.camp;

import com.project01_teamA.camping_lounge.entity.camp.Campsite;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResCampWriteDto {
    private Long id;
    private String campName;
    private String campInfo;
    private String campTel;
    private String campAddressDo;
    private String campAddressGungu;
    private String campAddress1;
    private String campAddress2;
    private String campMapX;
    private String campMapY;
    private Integer toilet;
    private Boolean hotWater;
    private Boolean electric;
    private Boolean fireWood;
    private Boolean wifi;
    private Boolean playGround;
    private Boolean pet;
    private Boolean swimming;
    private Integer totalCapacity;
    private String createdDate;

    @Builder
    public ResCampWriteDto(Long id, String campName, String campInfo, String campTel, String campAddressDo, String campAddressGungu, String campAddress1, String campAddress2, String campMapX, String campMapY, Integer toilet, Boolean hotWater, Boolean electric, Boolean fireWood, Boolean wifi, Boolean playGround, Boolean pet, Boolean swimming, Integer totalCapacity, String createdDate) {
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
        this.createdDate = createdDate;
    }

    public static ResCampWriteDto fromEntity (Campsite campsite){
        return ResCampWriteDto.builder()
                .id(campsite.getId())
                .campName(campsite.getCampName())
                .campInfo(campsite.getCampInfo())
                .campTel(campsite.getCampTel())
                .campAddressDo(campsite.getCampAddressDo())
                .campAddressGungu(campsite.getCampAddressGungu())
                .campAddress1(campsite.getCampAddress1())
                .campAddress2(campsite.getCampAddress2())
                .campMapX(campsite.getCampMapX())
                .campMapY(campsite.getCampMapY())
                .toilet(campsite.getToilet())
                .hotWater(campsite.getHotWater())
                .electric(campsite.getElectric())
                .fireWood(campsite.getFireWood())
                .wifi(campsite.getWifi())
                .playGround(campsite.getPlayGround())
                .pet(campsite.getPet())
                .swimming(campsite.getSwimming())
                .totalCapacity(campsite.getTotalCapacity())
                .createdDate(campsite.getCreatedDate())
                .build();
    }
}
