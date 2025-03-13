import { useEffect, useState, useRef, useContext } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import "../../css/chatting.css";
import "../../css/style.css";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";
import ChatList from "./ChatList";

const Chat = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const { headers, setHeaders } = useContext(HttpHeadersContext);
    const token = localStorage.getItem("CL_access_token");
    const userId = localStorage.getItem("id");
    const [targetId, setTargetId] = useState(localStorage.getItem("id2"));
    const [targetProfile, setTargetProfile] = useState("");
    const chatRoomRef = useRef(null);  // 스크롤을 위한 ref 추가
    const [targetName, setTargetName] = useState("");

    useEffect(() => {
        if (!token || !userId || !targetId) {
            console.error("필요한 정보 부족! WebSocket 연결 불가능");
            return;
        }

        setHeaders({ "Authorization": `Bearer ${token}` });

        // 사용자 정보 가져오기
        axios.get("http://localhost:8080/member/getUserInfoById", {
            params: { id: targetId },
            headers
        }).then(response => {
            setTargetName(response.data.name || "알 수 없는 사용자");
            if (response.data.profile === true) {
                axios.get("http://localhost:8080/member/getProfileByUserId", {
                    params: { userId: targetId },
                    headers
                }).then(profileResponse => {
                    setTargetProfile(`http://localhost:8080/uploads/${profileResponse.data}`);
                }).catch(error => console.error("프로필 이미지 가져오기 오류:", error));
            }
        }).catch(error => console.error("사용자 정보 가져오기 오류:", error));

        // WebSocket 연결 설정
        if (stompClient) return;

        const socket = new SockJS(`http://localhost:8080/chat?token=${token}`);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            console.log("WebSocket 연결 성공!");

            client.unsubscribe(`/topic/messages/${userId}/${targetId}`);

            client.subscribe(`/topic/messages/${userId}/${targetId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages((prev) => [...prev, newMessage]);
            });

            axios.get(`http://localhost:8080/chat/exists/${userId}/${targetId}`, { headers })
                .then(response => {
                    if (response.data.exists) {
                        axios.get(`http://localhost:8080/chat/messages/${userId}/${targetId}`, { headers })
                            .then(response => setMessages(response.data))
                            .catch(error => console.error("메시지 가져오기 오류:", error));
                    } else {
                        console.log("채팅방이 존재하지 않습니다.");
                    }
                })
                .catch(error => console.error("채팅 존재 여부 확인 오류:", error));
        };

        // 채팅 목록 가져오기
        axios.get(`http://localhost:8080/chat/list/${userId}`)
        .then(response => {
            const updatedChats = response.data.map(chat => {

                let lTargetId = 0;
                if (Number(userId) !== chat.member1Id) {
                    lTargetId = chat.member1Id;
                }
                else if (Number(userId) !== chat.member2Id) {
                    lTargetId = chat.member2Id;
                }

                return axios.get("http://localhost:8080/member/getUserInfoById", {
                    params: { id: lTargetId }
                }).then(userRes => {

                    const hasProfile = userRes.data.profile === true;

                    if (hasProfile) {
                        return axios.get("http://localhost:8080/member/getProfileByUserId", {
                            params: { userId: lTargetId }
                        }).then(res => ({
                            ...chat,
                            profilePath: `http://localhost:8080/uploads/${res.data}`
                        })).catch(() => {
                            return { ...chat, profilePath: "" };
                        });
                    } else {
                        return { ...chat, profilePath: "" };
                    }
                })
                .catch(error => {
                    return { ...chat, profilePath: "" };
                });
            });

            Promise.all(updatedChats).then(setChatRooms);
        })
        .catch(error => console.error("채팅 목록 가져오기 오류:", error));

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
        };

    }, [token, targetId]);

    useEffect(() => {
        // 새로운 메시지가 추가될 때 스크롤을 아래로 이동
        if (chatRoomRef.current) {
            chatRoomRef.current.scrollTop = chatRoomRef.current.scrollHeight;
        }
    }, [messages]);  // messages 변경 시 실행

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!stompClient || input.trim() === "") return;

        if (!targetId) {
            console.error("targetId 없음!");
            return;
        }

        const chatMessage = {
            member1Id: Number(userId),
            member2Id: Number(targetId),
            content: input
        };

        stompClient.publish({
            destination: "/app/send",
            body: JSON.stringify(chatMessage),
        });

        setInput("");
    };

    const enterChat = (member1, member2) => {
        const userIdNum = Number(userId);  // userId를 숫자로 변환
        const targetId2 = userIdNum === member1 ? member2 : member1;
        // targetId 상태를 변경하여 해당 채팅방의 메시지를 불러오도록 처리
        setTargetId(targetId2);
    };

    // targetId가 변경될 때마다 메시지 가져오는 useEffect 추가
    useEffect(() => {
        if (targetId) {
            axios.get(`http://localhost:8080/chat/messages/${userId}/${targetId}`, { headers })
                .then(response => setMessages(response.data))
                .catch(error => console.error("메시지 가져오기 오류:", error));
        }
    }, [targetId]); // targetId가 변경될 때마다 실행

    return (
        <main id="main" className="chatting">
            <div className="inner_01">
                <div className="chat_container">
                    <div className="chat-list_area">
                        <p className="title tit-md txt-a-c">채팅 목록</p>
                        <div className="chat-list-wrap">
                            {chatRooms.length === 0 ? (
                                <p className="no-chat"></p>
                            ) : (
                                <ul className="chat-list">
                                    {chatRooms.map((chat, index) => (
                                        <li key={index} onClick={() => enterChat(chat.member1Id, chat.member2Id)}>
                                            <div className="item">
                                                <div className={chat.profilePath ? "profile-thumb" : "profile"}>
                                                    <img src={chat.profilePath || "default.jpg"} alt="프로필 이미지" />
                                                </div>
                                                <div className="txt-area">
                                                    <p className="chat-name">
                                                        {chat.memberName}
                                                    </p>
                                                    <p className="last-chat">
                                                        {chat.content}
                                                    </p>
                                                    <p className="chat-time">
                                                        {new Date(chat.createAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className="chat-room_area">
                        {/* ref 추가하여 채팅 창 참조 */}
                        <div className="chat-room" ref={chatRoomRef}>
                            {messages
                                .filter(msg =>
                                    (msg.member1Id === Number(userId) && msg.member2Id === Number(targetId)) ||
                                    (msg.member1Id === Number(targetId) && msg.member2Id === Number(userId))
                                )
                                .map((msg, index) => {
                                    const isMyMessage = msg.member1Id === Number(userId);
                                    return (
                                        <div key={index} className={isMyMessage ? "recipient" : "sender"}>
                                            <div className="item">
                                                {!isMyMessage && (
                                                    <div className={targetProfile ? "profile-thumb" : "profile"}>
                                                        <img
                                                            src={targetProfile || "/default-profile.png"}
                                                            alt="프로필 이미지"
                                                            onError={(e) => {
                                                                console.error("이미지 로딩 실패:", e.target.src);
                                                                e.target.src = "/default-profile.png";
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="txt-area">
                                                    {!isMyMessage && (
                                                        <p className="chat-name">
                                                            <a href="member-detail.html">{targetName || "알 수 없는 사용자"}</a>
                                                        </p>
                                                    )}
                                                    <p className="last-chat">{msg.content}</p>
                                                    <div className="date">{new Date(msg.createAt).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                        <div className="message-area">
                            <div className="message-inner">
                                <form onSubmit={sendMessage} className="chatting-form">
                                    <input
                                        type="text"
                                        className="input-txt input-max"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="메시지를 입력하세요."
                                    />
                                    <button type="submit" className="submit-f input-sm">발송</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Chat;