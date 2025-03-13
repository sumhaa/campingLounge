package com.project01_teamA.camping_lounge.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatMsgId;

    @Column(nullable = false)
    private Long member1Id;

    @Column(nullable = false)
    private Long member2Id;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createAt;

    private Boolean isNew;

    @Transient
    private String memberName;


    @Builder
    public ChatMessage(String content, Long chatMsgId, Long member1Id, Long member2Id, Date createAt, Boolean isNew, String memberName) {
        this.content = content;
        this.chatMsgId = chatMsgId;
        this.member1Id = member1Id;
        this.member2Id = member2Id;
        this.createAt = createAt;
        this.isNew = isNew;
        this.memberName = memberName;
    }
}