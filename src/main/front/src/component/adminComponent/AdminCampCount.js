import {useEffect, useState, useContext} from "react";
import axios from "axios";
import {HttpHeadersContext} from "../context/HttpHeadersProvider";

function AdminCampCount(){
    const [campCount, setCampCount] = useState(0);
    const token = localStorage.getItem("CL_access_token");
    const { headers, setHeaders } = useContext(HttpHeadersContext);

    const getCampCount = async ()=> {
        try {
            const response = await axios.get(`http://localhost:8080/admin/dashboard/camp`, {headers: headers});
            console.log("[AdminDashBoard.js] getCampCount() success.");
            console.log(response.data)
            setCampCount(response.data);
        } catch (error){
            console.log("[AdminDashBoard.js] getCampCount() error.");
            console.log(error)
        }
    }

    useEffect(() => {
        getCampCount();
        setHeaders({ "Authorization": `Bearer ${token}` });
    }, []);
    return (
        <>
            <div className="icon"><img src="/images/camp/icon_playground.svg"
                                       alt=""/></div>
            <p className="fs_lg mt_md mb_md">등록된 캠핑장</p>
            <p className="fs_xlg">{campCount} 개</p>
        </>
    );
}
export default AdminCampCount;