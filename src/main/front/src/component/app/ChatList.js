import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/chatting.css";
import "../../css/style.css";
import ChatRoom from "./ChatRoom";

const ChatList = () => {

    const [chatRooms, setChatRooms] = useState([]);
    const userId = Number(localStorage.getItem("id")); // 숫자로 변환
    const userName = localStorage.getItem("name");
    const [selectedChat, setSelectedChat] = useState(null); // 선택된 상대 ID
    const navigate = useNavigate();

    const getChatList = () => {
        axios.get(`http://localhost:8080/chat/list/${userId}`)
        .then(response => {

            //채팅 목록의 첫번째 상대의 채팅 내용 노출을 위한 상대 ID SET
            const firstChat = response.data[0];
            const firstMember1Id = firstChat.member1Id;
            const firstMember2Id = firstChat.member2Id;
            let firstTargetId = firstMember1Id === userId ? firstMember2Id : firstMember1Id;
            // 만약 targetId가 여전히 userId와 같다면, 반대 멤버 값을 설정
            if (firstTargetId === userId) {
                firstTargetId = firstMember2Id;
            }
            setSelectedChat(firstTargetId);

            const updatedChats = response.data.map(chat => {
                let targetId = chat.member1Id === userId ? chat.member2Id : chat.member1Id;

                // 만약 targetId가 여전히 userId와 같다면, 반대 멤버 값을 설정
                if (targetId === userId) {
                    targetId = chat.member2Id;
                }

                return axios.get("http://localhost:8080/member/getUserInfoById", {
                    params: { id: targetId }
                }).then(userRes => {

                    const hasProfile = userRes.data.profile === true;

                    if (hasProfile) {
                        return axios.get("http://localhost:8080/member/getProfileByUserId", {
                            params: { userId: targetId }
                        }).then(res => ({
                            ...chat,
                            profilePath: `http://localhost:8080/uploads/${res.data}`
                        })).catch(() => {
                            return { ...chat, profilePath: "" }; // 에러 발생해도 콘솔 출력 없음
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
        .catch(error => console.warn("채팅 목록이 존재하지 않습니다.", error));
    }

    // 1. 채팅 목록 가져오기 (초기 1회 실행)
    useEffect(() => {
        if (!userId) {
            navigate("/login");
        }

    getChatList();
    }, [userId]); // userId 변경 시 실행 (일반적으로 한 번만 실행됨)

    // 2. 선택된 채팅방이 존재하는지 확인 (selectedChat이 변경될 때만 실행)
    useEffect(() => {

        if (!selectedChat) return; // selectedChat이 없을 때 API 요청 방지

        axios.get(`http://localhost:8080/chat/exists/${userId}/${selectedChat}`)
            .then(response => {
                if (!response.data.exists) {
                    console.log("선택한 채팅방이 존재하지 않습니다.");
                    setSelectedChat(null); // 존재하지 않으면 선택 해제
                }
            })
            .catch(error => console.error("채팅 존재 여부 확인 오류:", error));


    }, [selectedChat, userId]); // selectedChat이 변경될 때만 실행

    const enterChat = (member1, member2) => {
        const userIdNum = Number(userId);  // userId를 숫자로 변환
        const targetId = userIdNum === member1 ? member2 : member1;
        //localStorage.setItem("id2", targetId);
        setSelectedChat(targetId);
    };

    return (
        <main id="main" className="chatting">
            <div className="inner_01">
                <div className="chat_container">
                    <div className="chat-list_area">
                        <p className="title tit-md txt-a-c">채팅 목록</p>
                        <div className="chat-list-wrap">
                            {chatRooms.length === 0 ? (
                                <p className="no-chat">채팅 목록이 존재하지 않습니다.</p>
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

                    {<ChatRoom selectedChat={selectedChat} />}
                </div>
            </div>
        </main>
    );


};

export default ChatList;