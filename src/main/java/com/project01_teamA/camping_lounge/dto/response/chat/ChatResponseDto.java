package com.project01_teamA.camping_lounge.dto.response.chat;

import com.project01_teamA.camping_lounge.dto.response.member.MemberResponseDto;
import com.project01_teamA.camping_lounge.entity.ChatMessage;
import com.project01_teamA.camping_lounge.entity.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Transient;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class ChatResponseDto {
    private Long chatMsgId;

    private Long member1Id;

    private Long member2Id;

    private String content;

    private Date createAt;

    private Boolean isNew;

    private String memberName;


    @Builder
    public ChatResponseDto(Long chatMsgId, Long member1Id, Long member2Id, String content, Date createAt, Boolean isNew, String memberName) {
        this.chatMsgId = chatMsgId;
        this.member1Id = member1Id;
        this.member2Id = member2Id;
        this.content = content;
        this.createAt = createAt;
        this.isNew = isNew;
        this.memberName = memberName;
    }

    public static ChatResponseDto fromEntity(ChatMessage chatMessage) {
        return ChatResponseDto.builder()
                .chatMsgId(chatMessage.getChatMsgId())
                .member1Id(chatMessage.getMember1Id())
                .member2Id(chatMessage.getMember2Id())
                .content(chatMessage.getContent())
                .createAt(chatMessage.getCreateAt())
                .isNew(chatMessage.getIsNew())
                .memberName(chatMessage.getMemberName())
                .build();
    }

}
