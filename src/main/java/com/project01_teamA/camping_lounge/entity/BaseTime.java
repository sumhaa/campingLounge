package com.project01_teamA.camping_lounge.entity;

import jakarta.persistence.*;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
@EnableJpaAuditing
public class BaseTime {

    // 작성 시간
    @CreatedDate
    @Column(name = "review_posting_date", updatable = false)
    private String reviewPostingDate;

    // 수정 시간
    @LastModifiedDate
    @Column(name = "review_editing_date")
    private String reviewEditingDate;

    @PrePersist
    public void onPrePersist(){
        this.reviewPostingDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"));
    }

    @PreUpdate
    public void onPreUpdate(){
        this.reviewEditingDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"));
    }

    }
