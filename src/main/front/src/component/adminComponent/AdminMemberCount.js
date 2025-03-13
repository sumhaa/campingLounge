import {useEffect, useState, useContext } from "react";
import axios from "axios";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

function AdminMemberCount(){
    const [memberCount, setMemberCount] = useState(0);
    const token = localStorage.getItem("CL_access_token");
    const { headers, setHeaders } = useContext(HttpHeadersContext);


    useEffect(()=>{
        getMemberCount();
        setHeaders({ "Authorization": `Bearer ${token}` });
    },[])

    const getMemberCount = async ()=> {
        try {
            const response = await axios.get(`http://localhost:8080/admin/dashboard/member`, { headers });
            console.log("[AdminDashBoard.js] getMemberCount() success.");
            console.log(response.data)
            setMemberCount(response.data);
        }catch (error){
            console.log("[AdminDashBoard.js] getMemberCount() error.");
            console.log(error)
        }
    }
    return (
        <>
            <div className="icon"><img src="/images/common/icon_login.svg" alt=""/>
            </div>
            <p className="fs_lg mt_md mb_md">전체 회원</p>
            <p className="fs_xlg">{memberCount} 명</p>
        </>
    );
}

export default AdminMemberCount;