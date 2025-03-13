package com.project01_teamA.camping_lounge.repository.camp;

import com.project01_teamA.camping_lounge.dto.response.camp.ResCampListDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CampRepositoryCustom {
    Page<ResCampListDto> findFilteredCamps(String search, List<String> filters, Pageable pageable);
}
