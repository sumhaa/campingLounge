import {useEffect, useState, useContext } from "react";
import axios from "axios";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

function AdminReservationCount(){

    const [resCount, setResCount] = useState(0);
    const token = localStorage.getItem("CL_access_token");
    const { headers, setHeaders } = useContext(HttpHeadersContext);


    const getResCount = async ()=> {
        try {
            const response = await axios.get(`http://localhost:8080/admin/dashboard/res`, { headers });
            console.log("[AdminDashBoard.js] getResCount() success.");
            console.log(response.data)
            setResCount(response.data);
        } catch (error){
            console.log("[AdminDashBoard.js] getResCount() error.");
            console.log(error)
        }
    }

    useEffect(()=>{
        getResCount();
        setHeaders({ "Authorization": `Bearer ${token}` });
    },[])

    return(
        <>
            <div className="icon"><img src="/images/common/icon_booking.svg" alt=""/>
            </div>
            <p className="fs_lg mt_md mb_md">진행된 예약</p>
            <p className="fs_xlg">{resCount} 건</p>
        </>
    );
}

export default AdminReservationCount;