import {useEffect, useState, useContext } from "react";
import axios from "axios";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

function AdminReviewCount(){
    const [reviewCount, setReviewCount] = useState(0);
    const token = localStorage.getItem("CL_access_token");
    const { headers, setHeaders } = useContext(HttpHeadersContext);

    const getReviewCount = async ()=> {
        try {
            const response = await axios.get(`http://localhost:8080/admin/dashboard/review`, { headers });
            console.log("[AdminDashBoard.js] AdminReviewCount() success.");
            console.log(response.data)
            setReviewCount(response.data);
        }catch (error){
            console.log("[AdminDashBoard.js] AdminReviewCount() error.");
            console.log(error)
        }
    }

    useEffect(() => {
       getReviewCount();
       setHeaders({ "Authorization": `Bearer ${token}` });
    }, []);
    return (
        <>
            <div className="icon"><img src="/images/common/icon_review.svg"
                                       alt=""/></div>
            <p className="fs_lg mt_md mb_md">등록된 리뷰</p>
            <p className="fs_xlg">{reviewCount} 개</p>
        </>
    );
}
export default AdminReviewCount;