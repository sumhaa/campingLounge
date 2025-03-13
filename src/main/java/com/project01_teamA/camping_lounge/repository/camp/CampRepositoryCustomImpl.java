package com.project01_teamA.camping_lounge.repository.camp;

import com.project01_teamA.camping_lounge.dto.response.camp.ResCampListDto;
import com.project01_teamA.camping_lounge.dto.response.camp.ResCampThumbUploadDto;
import com.project01_teamA.camping_lounge.entity.camp.Campsite;
import com.project01_teamA.camping_lounge.entity.camp.QCampThumbFiles;
import com.project01_teamA.camping_lounge.entity.camp.QCampsite;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class CampRepositoryCustomImpl implements CampRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public Page<ResCampListDto> findFilteredCamps(String search, List<String> filters, Pageable pageable) {
        QCampsite camp = QCampsite.campsite;
        BooleanBuilder builder = new BooleanBuilder();

        //검색기능
        if (search != null && !search.isBlank()) {
            BooleanBuilder searchCondition = new BooleanBuilder();
            searchCondition.or(camp.campName.containsIgnoreCase(search));
            searchCondition.or(camp.campAddressDo.containsIgnoreCase(search));
            searchCondition.or(camp.campAddressGungu.containsIgnoreCase(search));

            builder.and(searchCondition);
        }

        //필터 기능
        if (filters != null && !filters.isEmpty()){
            for(String filter : filters){
                switch (filter){
                    case "화장실": builder.and(camp.toilet.gt(0)); break;
                    case "온수": builder.and(camp.hotWater.eq(true)); break;
                    case "전기": builder.and(camp.electric.eq(true)); break;
                    case "장작 판매": builder.and(camp.fireWood.eq(true)); break;
                    case "와이파이": builder.and(camp.wifi.eq(true)); break;
                    case "운동시설": builder.and(camp.playGround.eq(true)); break;
                    case "반려동물": builder.and(camp.pet.eq(true)); break;
                    case "물놀이": builder.and(camp.swimming.eq(true)); break;

                }
            }
        }

        //페이징
        OrderSpecifier<Long> orderById = camp.id.desc();
        List<Campsite> campList = queryFactory
                .select(camp)
                .where(builder)
                .orderBy(orderById)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .from(camp)
                .fetch();

        long total = queryFactory
                .selectFrom(camp)
                .where(builder)
                .fetchCount();

        //DTO 전환
        List<ResCampListDto> dtoList = campList.stream()
                .map(c -> ResCampListDto.builder()
                        .id(c.getId())
                        .campName(c.getCampName())
                        .campInfo(c.getCampInfo())
                        .campAddressDo(c.getCampAddressDo())
                        .campAddressGungu(c.getCampAddressGungu())
                        .campHit(c.getCampHit())
                        .campLike(c.getCampLike())
                        .thumb(c.getThumb().stream()
                                .map(ResCampThumbUploadDto::fromEntity)
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, total);
    }
}
