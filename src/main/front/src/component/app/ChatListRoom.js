import { useState } from "react";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";
import "../../css/chatting.css";
import "../../css/style.css";

const ChatListRoom = () => {
    const [selectedChat, setSelectedChat] = useState(""); // 부모에서 상태 관리

    return (
        <div>
            <ChatList />
        </div>
    );
};

export default ChatListRoom;