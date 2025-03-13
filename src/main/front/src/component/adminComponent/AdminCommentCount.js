import {useEffect, useState, useContext } from "react";
import axios from "axios";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

function AdminCommentCount(){
    const [commentCount, setCommentCount] = useState(0);
    const token = localStorage.getItem("CL_access_token");
    const { headers, setHeaders } = useContext(HttpHeadersContext);
    const getCommentCount = async ()=> {
        try {
            const response = await axios.get(`http://localhost:8080/admin/dashboard/comment`, { headers });
            console.log("[AdminDashBoard.js] AdminCommentCount() success.");
            console.log(response.data)
            setCommentCount(response.data);
        }catch (error){
            console.log("[AdminDashBoard.js] AdminCommentCount() error.");
            console.log(error)
        }
    }

    useEffect(() => {
        getCommentCount();
        setHeaders({ "Authorization": `Bearer ${token}` });
    }, []);
    return (
        <>
            <div className="icon"><img src="/images/common/icon_comment.svg"
                                       alt=""/></div>
            <p className="fs_lg mt_md mb_md">등록된 댓글</p>
            <p className="fs_xlg">{commentCount} 개</p>
        </>
    );
}
export default AdminCommentCount;