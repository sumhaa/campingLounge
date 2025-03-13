package com.project01_teamA.camping_lounge.service;

import com.project01_teamA.camping_lounge.dto.request.chat.ChatRequestDto;
import com.project01_teamA.camping_lounge.dto.response.chat.ChatResponseDto;
import com.project01_teamA.camping_lounge.dto.response.member.MemberResponseDto;
import com.project01_teamA.camping_lounge.entity.ChatMessage;
import com.project01_teamA.camping_lounge.entity.Member;
import com.project01_teamA.camping_lounge.repository.ChatMessageRepository;
import com.project01_teamA.camping_lounge.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Date;
import java.util.List;

@RequiredArgsConstructor
@Service
public class ChatService {
    private final ChatMessageRepository chatMessageRepository;
    private final MemberRepository memberRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * 특정 사용자와 특정 대상의 채팅 메시지 가져오기
     */
    public List<ChatResponseDto> findChatMessages(Long member1Id, Long member2Id) {
        if (member1Id == null || member2Id == null) {
            return Collections.emptyList();
        }
        return chatMessageRepository.findChatMessages(member1Id, member2Id)
                .stream()  // Stream으로 변환
                .map(ChatResponseDto::fromEntity)  // DTO로 변환
                .toList();
    }

    /**
     * 특정 사용자와 대상의 채팅방 존재 여부 확인
     */
    public boolean doesChatExist(Long member1Id, Long member2Id) {
        return chatMessageRepository.existsByMember1IdAndMember2Id(member1Id, member2Id)
                || chatMessageRepository.existsByMember1IdAndMember2Id(member2Id, member1Id);
    }

    public List<ChatResponseDto> getLatestMessages(Long userId) {
        List<ChatResponseDto> chatMessageList = chatMessageRepository.findLatestMessagesByUser(userId)
                .stream()  // Stream으로 변환
                .map(ChatResponseDto::fromEntity)  // DTO로 변환
                .toList();

        //채팅 목록 화면에서 상대방 이름 표시
        for (ChatResponseDto message : chatMessageList) {
            Long member1Id = message.getMember1Id();
            Long member2Id = message.getMember2Id();

            Long targetId = userId.equals(member1Id) ? member2Id : member1Id;

            Member member = memberRepository.findById(targetId).orElse(null);
            if(member != null) {
                message.setMemberName(member.getName());
            }
            // 탈퇴한 사용자면 채팅 목록에 노출 X
            else {
                message.setMemberName("알 수 없는 사용자");
                //message = null;
            }

        }

        return chatMessageList;
    }

    public ChatResponseDto sendMessage(ChatRequestDto messageDto) {
        // DTO → Entity 변환
        ChatMessage savedMessage = chatMessageRepository.save(messageDto.toEntity());

        // Entity → DTO 변환
        ChatResponseDto responseDto = ChatResponseDto.fromEntity(savedMessage);

        // 메시지를 양방향으로 전송
        messagingTemplate.convertAndSend("/topic/messages/" + responseDto.getMember1Id() + "/" + responseDto.getMember2Id(), responseDto);
        messagingTemplate.convertAndSend("/topic/messages/" + responseDto.getMember2Id() + "/" + responseDto.getMember1Id(), responseDto);

        return responseDto;
    }
}
