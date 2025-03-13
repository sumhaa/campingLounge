import { useEffect, useState, useContext, useRef } from "react";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import "../../css/chatting.css";
import "../../css/style.css";

const ChatRoom = ({ selectedChat }) => {
    const { headers } = useContext(HttpHeadersContext);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const token = localStorage.getItem("CL_access_token");
    const userId = localStorage.getItem("id");
    const targetId = localStorage.getItem("id2");
    const [targetProfile, setTargetProfile] = useState("/default-profile.png");
    const [targetName, setTargetName] = useState("");
    const [isInputReadonly, setIsInputReadonly] = useState(false); // readonly 상태
    const [placeholderText, setPlaceholderText] = useState("메시지를 입력하세요."); // placeholder 상태

    const chatEndRef = useRef(null);

    // 메시지 & 프로필 정보 불러오기
    useEffect(() => {

        setIsInputReadonly(false); // 입력창을 readonly로 설정
        setPlaceholderText("메시지를 입력하세요."); // placeholder 변경


        if (!userId) return;

        if (!selectedChat) {

            return;
        }

        // 메시지 가져오기
        axios.get(`http://localhost:8080/chat/messages/${userId}/${selectedChat}`, { headers })
            .then(response => setMessages(response.data))
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    // 404 오류는 무시하고 아무 동작도 하지 않음
                } else {
                    console.error(" 메시지 가져오기 오류:", error);
                }
            });

        // 사용자 정보 가져오기
        axios.get("http://localhost:8080/member/getUserInfoById", {
            params: { id: selectedChat },
            headers
        }).then(response => {
            setTargetName(response.data.name || "알 수 없는 사용자");

            if (response.data.profile) {
                axios.get("http://localhost:8080/member/getProfileByUserId", {
                    params: { userId: selectedChat },
                    headers
                }).then(profileResponse => {
                    setTargetProfile(`http://localhost:8080/uploads/${profileResponse.data}`);
                }).catch(error => {
                    if (error.response && error.response.status === 404) {
                        // 프로필 이미지가 없으면 기본 이미지 사용
                    } else {
                        setTargetProfile("");
                        console.error(" 프로필 이미지 가져오기 오류:", error);
                    }
                });
            } else {
                setTargetProfile("/default-profile.png");
            }
        }).catch(
            // 사용자 정보 가져오기 실패 시 기본 값 설정 (이 에러는 404 제외하고 처리)
            error => {
                setTargetName("알 수 없는 사용자");
                setTargetProfile("/default-profile.png");
                setIsInputReadonly(true); // 입력창을 readonly로 설정
                setPlaceholderText("채팅 불가능한 사용자입니다."); // placeholder 변경
            }
        );
    }, [selectedChat, userId]);

    // WebSocket 연결 설정
    useEffect(() => {
        if (!userId || !selectedChat) return;

        // 기존 연결 해제 (중복 연결 방지)
        if (stompClient) {
            stompClient.deactivate();
        }

        const socket = new SockJS(`http://localhost:8080/chat?token=${token}`);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            console.log("WebSocket 연결 성공!");
            client.subscribe(`/topic/messages/${userId}/${selectedChat}`, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages((prevMessages) => {
                    const isDuplicate = prevMessages.some(
                        (msg) => msg.content === newMessage.content && msg.member1Id === newMessage.member1Id
                    );
                    return isDuplicate ? prevMessages : [...prevMessages, newMessage];
                });
            });
        };

        client.onWebSocketClose = () => {
            console.error(" WebSocket 연결이 종료되었습니다. 다시 연결 시도 중...");
            setTimeout(() => client.activate(), 5000);
        };

        client.activate();
        setStompClient(client);

        // 클린업: 채팅방 변경 시 기존 연결 해제
        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [selectedChat, userId]);

    // 메시지가 변경될 때 자동 스크롤
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // 메시지 전송
    const sendMessage = (e) => {
        e.preventDefault();

        if (!stompClient || !stompClient.connected) {
            console.error(" STOMP 클라이언트가 연결되지 않았습니다.");
            return;
        }

        if (input.trim() === "") return;

        const chatMessage = {
            member1Id: Number(userId),
            member2Id: Number(selectedChat),
            content: input,
        };

        stompClient.publish({
            destination: "/app/send",
            body: JSON.stringify(chatMessage),
        });

        setInput("");
    };

    return (
        <>
            <div className="chat-room_area">
                <div className="chat-room">
                    {messages.map((msg, index) => {
                        const isMyMessage = msg.member1Id === Number(userId);
                        return (
                            <div key={index} className={isMyMessage ? "recipient" : "sender"}>
                                <div className="item">
                                    {!isMyMessage && (
                                        <div className={targetProfile !== "/default-profile.png" ? "profile-thumb" : "profile"}>
                                            <img
                                                src={targetProfile}
                                                alt="프로필 이미지"
                                                onError={(e) => { e.target.src = "/default-profile.png"; }}
                                            />
                                        </div>
                                    )}
                                    <div className="txt-area">
                                        {!isMyMessage && <p className="chat-name">{targetName || "알 수 없는 사용자"}</p>}
                                        <p className="last-chat">{msg.content}</p>
                                        <div className="date">{new Date(msg.createAt).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>
                {selectedChat && (
                    <div className="message-area">
                        <div className="message-inner">
                            <form onSubmit={sendMessage} className="chatting-form">
                                <input
                                    type="text"
                                    className="input-txt input-max"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={placeholderText} // 변경된 placeholder 사용
                                    readOnly={isInputReadonly} // readonly 상태 적용
                                />
                                {!isInputReadonly && (
                                    <button type="submit" className="submit-f input-sm">발송</button>
                                )}
                            </form>
                        </div>
                    </div>
                 )}
            </div>
        </>
    );
};

export default ChatRoom;