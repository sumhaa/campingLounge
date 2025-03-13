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
public class ReviewFiles {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private Long reviewFilesId;

    @ManyToOne
    @JoinColumn(name = "review_id")
    private Review review;

    @Column(name = "origin_file_name")
    private String originFileName;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "file_path")
    private String filePath;

    @Builder
    public ReviewFiles(Long reviewFilesId, Review review, String originFileName, String fileType, String filePath) {
        this.reviewFilesId = reviewFilesId;
        this.review = review;
        this.originFileName = originFileName;
        this.fileType = fileType;
        this.filePath = filePath;
    }
}
