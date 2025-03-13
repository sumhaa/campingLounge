package com.project01_teamA.camping_lounge.dto.request.chat;

import com.project01_teamA.camping_lounge.entity.ChatMessage;
import com.project01_teamA.camping_lounge.entity.Comment;
import com.project01_teamA.camping_lounge.entity.Member;
import com.project01_teamA.camping_lounge.entity.Review;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class ChatRequestDto {
    private Long chatMsgId;

    private Long member1Id;

    private Long member2Id;

    private String content;

    private Date createAt;

    private Boolean isNew;

    private String memberName;

    @Builder
    public ChatRequestDto(Long chatMsgId, Long member1Id, Long member2Id, String content, Date createAt, Boolean isNew, String memberName) {
        this.chatMsgId = chatMsgId;
        this.member1Id = member1Id;
        this.member2Id = member2Id;
        this.content = content;
        this.createAt = createAt;
        this.isNew = isNew;
        this.memberName = memberName;
    }

    public ChatMessage toEntity() {
        return ChatMessage.builder()
                .chatMsgId(this.chatMsgId)
                .member1Id(this.member1Id)
                .member2Id(this.member2Id)
                .content(this.content)
                .createAt(new Date()) // 현재 시간 적용
                .isNew(true) // 기본적으로 새 메시지로 설정
                .memberName(this.memberName)
                .build();
    }


}
