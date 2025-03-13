import {useEffect, useState, useContext } from "react";
import axios from "axios";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

function AdminChattingCount(){
    const [chattingCount, setChattingCount] = useState(0);
    const token = localStorage.getItem("CL_access_token");
    const { headers, setHeaders } = useContext(HttpHeadersContext);
    const getChattingCount = async ()=> {
        try {
            const response = await axios.get(`http://localhost:8080/admin/dashboard/chatting`, { headers });
            console.log("[AdminDashBoard.js] AdminChattingCount() success.");
            console.log(response.data)
            setChattingCount(response.data);
        }catch (error){
            console.log("[AdminDashBoard.js] AdminChattingCount() error.");
            console.log(error)
        }
    }

    useEffect(() => {
       getChattingCount();
       setHeaders({ "Authorization": `Bearer ${token}` });

    }, []);
    return (
        <>
            <div className="icon"><img src="/images/common/icon_chatting.svg"
                                       alt=""/></div>
            <p className="fs_lg mt_md mb_md">전체 채팅 수</p>
            <p className="fs_xlg">{chattingCount} 개</p>
        </>
    );
}
export default AdminChattingCount;