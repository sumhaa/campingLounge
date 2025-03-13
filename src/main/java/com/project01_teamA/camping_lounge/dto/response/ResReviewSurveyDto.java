package com.project01_teamA.camping_lounge.dto.response;

import com.project01_teamA.camping_lounge.entity.ReviewSurvey;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ResReviewSurveyDto {

    private Long surveyId;
    private Integer surveySatisfaction;
    private Integer surveySiteSize;
    private Integer surveyCleanStatus;
    private Integer surveyKindness;

    @Builder
    public ResReviewSurveyDto(Long surveyId, Integer surveySatisfaction, Integer surveySiteSize, Integer surveyCleanStatus, Integer surveyKindness) {
        this.surveyId = surveyId;
        this.surveySatisfaction = surveySatisfaction;
        this.surveySiteSize = surveySiteSize;
        this.surveyCleanStatus = surveyCleanStatus;
        this.surveyKindness = surveyKindness;
    }

    public static ResReviewSurveyDto fromEntity(ReviewSurvey reviewSurvey){
        return ResReviewSurveyDto.builder()
                .surveyId(reviewSurvey.getSurveyId())
                .surveySatisfaction(reviewSurvey.getSurveySatisfaction())
                .surveySiteSize(reviewSurvey.getSurveySiteSize())
                .surveyCleanStatus(reviewSurvey.getSurveyCleanStatus())
                .surveyKindness(reviewSurvey.getSurveyKindness())
                .build();
    }
}
