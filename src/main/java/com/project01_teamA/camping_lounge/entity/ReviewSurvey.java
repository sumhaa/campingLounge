package com.project01_teamA.camping_lounge.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ReviewSurvey {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "survey_id")
    private Long surveyId;

    @ManyToOne
    @JoinColumn(name = "review_id")
    private Review review;

    @Column(name = "survey_satisfaction")
    private Integer surveySatisfaction;

    @Column(name = "survey_site_size")
    private Integer surveySiteSize;

    @Column(name = "survey_clean_status")
    private Integer surveyCleanStatus;

    @Column(name = "survey_kindness")
    private Integer surveyKindness;

    @Builder
    public ReviewSurvey(Long surveyId, Review review, Integer surveySatisfaction, Integer surveySiteSize, Integer surveyCleanStatus, Integer surveyKindness) {
        this.surveyId = surveyId;
        this.review = review;
        this.surveySatisfaction = surveySatisfaction;
        this.surveySiteSize = surveySiteSize;
        this.surveyCleanStatus = surveyCleanStatus;
        this.surveyKindness = surveyKindness;
    }

    public void update(Integer surveySatisfaction, Integer surveySiteSize, Integer surveyCleanStatus, Integer surveyKindness) {
        this.surveySatisfaction = surveySatisfaction;
        this.surveySiteSize = surveySiteSize;
        this.surveyCleanStatus = surveyCleanStatus;
        this.surveyKindness = surveyKindness;
    }

}