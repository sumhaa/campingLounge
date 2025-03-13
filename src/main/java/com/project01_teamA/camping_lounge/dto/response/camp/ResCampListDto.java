package com.project01_teamA.camping_lounge.dto.response.camp;

import com.project01_teamA.camping_lounge.entity.camp.Campsite;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class ResCampListDto {
    private Long id;
    private String campName;
    private String campInfo;
    private String campAddressDo;
    private String campAddressGungu;
    private Integer toilet;
    private Boolean hotWater;
    private Boolean electric;
    private Boolean fireWood;
    private Boolean wifi;
    private Boolean playGround;
    private Boolean pet;
    private Boolean swimming;
    private Integer totalCapacity;
    private Integer campHit;
    private Integer campLike;
    private List<ResCampThumbUploadDto> thumb;

    @Builder
    public ResCampListDto(Long id, String campName, String campInfo, String campAddressDo, String campAddressGungu, Integer toilet, Boolean hotWater, Boolean electric, Boolean fireWood, Boolean wifi, Boolean playGround, Boolean pet, Boolean swimming, Integer totalCapacity, Integer campHit, Integer campLike, List<ResCampThumbUploadDto> thumb) {
        this.id = id;
        this.campName = campName;
        this.campInfo = campInfo;
        this.campAddressDo = campAddressDo;
        this.campAddressGungu = campAddressGungu;
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
    }

    public static ResCampListDto fromEntity(Campsite campsite) {
        return ResCampListDto.builder()
                .id(campsite.getId())
                .campName(campsite.getCampName())
                .campInfo(campsite.getCampInfo())
                .campAddressDo(campsite.getCampAddressDo())
                .campAddressGungu(campsite.getCampAddressGungu())
                .toilet(campsite.getToilet())
                .hotWater(campsite.getHotWater())
                .electric(campsite.getElectric())
                .fireWood(campsite.getFireWood())
                .wifi(campsite.getWifi())
                .playGround(campsite.getPlayGround())
                .pet(campsite.getPet())
                .swimming(campsite.getSwimming())
                .totalCapacity(campsite.getTotalCapacity())
                .campHit(campsite.getCampHit())
                .campLike(campsite.getCampLike())
                .thumb(campsite.getThumb().stream()
                        .map(ResCampThumbUploadDto::fromEntity)
                        .collect(Collectors.toList())
                )
                .build();
    }
}
