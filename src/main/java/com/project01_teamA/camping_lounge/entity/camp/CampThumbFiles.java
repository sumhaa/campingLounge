package com.project01_teamA.camping_lounge.entity.camp;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class CampThumbFiles {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="THUMB_ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CAMP_ID")
    private Campsite campsite;

    @Column
    private String originalFileName;

    @Column(name = "FILE_TYPE")
    private String fileType;

    @Column(name = "FILE_PATH", columnDefinition = "TEXT")
    private String filePath;

    @Builder
    public CampThumbFiles(Long id, String originalFileName, String fileType, String filePath) {
        this.id = id;
        this.originalFileName = originalFileName;
        this.fileType = fileType;
        this.filePath = filePath;
    }
    public void setMappingCamp(Campsite campsite) {this.campsite = campsite;}
}
