package com.project01_teamA.camping_lounge.controller;

import com.project01_teamA.camping_lounge.dto.request.chat.ChatRequestDto;
import com.project01_teamA.camping_lounge.dto.response.chat.ChatResponseDto;
import com.project01_teamA.camping_lounge.dto.response.member.MemberResponseDto;
import com.project01_teamA.camping_lounge.entity.ChatMessage;
import com.project01_teamA.camping_lounge.repository.ChatMessageRepository;
import com.project01_teamA.camping_lounge.service.ChatService;
import com.project01_teamA.camping_lounge.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/chat")
public class ChatController {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatService chatService;
    private final MemberService memberService;
    private final SimpMessagingTemplate messagingTemplate;


    //  특정 사용자와 특정 대상의 채팅 메시지 가져오기
    @GetMapping("/messages/{userId}/{targetId}")
    public ResponseEntity<List<ChatResponseDto>> getChatMessages(
            @PathVariable Long userId,
            @PathVariable Long targetId) {

        List<ChatResponseDto> messages = chatService.findChatMessages(userId, targetId);

        if (messages.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }

        return ResponseEntity.ok(messages);
    }


    //  특정 사용자의 채팅방 목록 가져오기
    @GetMapping("/list/{userId}")
    public ResponseEntity<List<ChatResponseDto>> getChatList(@PathVariable Long userId, Long selectedChat) {
        List<ChatResponseDto> chatList = chatService.getLatestMessages(userId);
        return ResponseEntity.ok(chatList);
    }

    //  특정 사용자와 특정 대상의 채팅방 존재 여부 확인
    @GetMapping("/exists/{userId}/{targetId}")
    public ResponseEntity<Map<String, Boolean>> checkChatExists(
            @PathVariable Long userId,
            @PathVariable Long targetId) {

        boolean exists = chatService.doesChatExist(userId, targetId);
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }

    //  새로운 채팅방 생성
    @PostMapping("/start")
    public ResponseEntity<String> startChat(@RequestBody Map<String, Long> request) {
        Long userId = request.get("userId");
        Long targetId = request.get("targetId");

        if (userId == null || targetId == null) {
            return ResponseEntity.badRequest().body("잘못된 요청입니다.");
        }

        boolean chatExists = chatService.doesChatExist(userId, targetId);
        if (chatExists) {
            return ResponseEntity.ok("이미 존재하는 채팅방입니다.");
        }
        return ResponseEntity.ok("채팅방이 없습니다.");
    }

    //  WebSocket을 통해 메시지 전송 및 특정 사용자에게 알림
    @MessageMapping("/send")
    public ChatResponseDto sendMessage(ChatRequestDto message) {
        return chatService.sendMessage(message);
    }
}