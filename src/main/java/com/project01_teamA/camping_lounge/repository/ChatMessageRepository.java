package com.project01_teamA.camping_lounge.repository;

import com.project01_teamA.camping_lounge.dto.response.chat.ChatResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.project01_teamA.camping_lounge.entity.ChatMessage;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {


    //  특정 사용자와 특정 대상의 채팅 존재 여부 확인
    boolean existsByMember1IdAndMember2Id(Long member1Id, Long member2Id);


    //이메일 1, 2 각각 member1, member2 혹은 member2, member1 일치하는 결과 가져옴
    @Query("SELECT c FROM ChatMessage c WHERE " +
            "(c.member1Id = :member1Id AND c.member2Id = :member2Id) " +
            "OR (c.member1Id = :member2Id AND c.member2Id = :member1Id)")
    List<ChatMessage> findChatMessages(
            @Param("member1Id") Long member1Id,
            @Param("member2Id") Long member2Id
    );

    // 각 채팅 상대별 마지막 메시지만 가져옴
    @Query("""
    SELECT cm FROM ChatMessage cm 
    WHERE cm.chatMsgId IN (
        SELECT MAX(c.chatMsgId) FROM ChatMessage c 
        WHERE (c.member1Id = :userId OR c.member2Id = :userId) 
        GROUP BY CASE 
            WHEN c.member1Id = :userId THEN c.member2Id 
            ELSE c.member1Id 
        END
    )
    ORDER BY cm.createAt DESC
    """)
    List<ChatMessage> findLatestMessagesByUser(@Param("userId") Long userId);


}
