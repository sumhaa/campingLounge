package com.project01_teamA.camping_lounge.dto.request.camp;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CampUpdateDto {
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

    @Builder
    public CampUpdateDto(String campName, String campInfo, String campTel, String campAddressDo, String campAddressGungu, String campAddress1, String campAddress2, String campMapX, String campMapY, Integer toilet, Boolean hotWater, Boolean electric, Boolean fireWood, Boolean wifi, Boolean playGround, Boolean pet, Boolean swimming, Integer totalCapacity) {
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
