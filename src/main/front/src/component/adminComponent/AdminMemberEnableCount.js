import {useEffect, useState, useContext } from "react";
import axios from "axios";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

function AdminMemberEnableCount() {
    const [disabledMemberCount, setDisabledMemberCount] = useState(0);
    const token = localStorage.getItem("CL_access_token");
    const { headers, setHeaders } = useContext(HttpHeadersContext);

    useEffect(() => {
        getDisabledMemberCount();
        setHeaders({ "Authorization": `Bearer ${token}` });
    }, []);

    const getDisabledMemberCount = async () => {
        try {
            const response = await axios.get("http://localhost:8080/admin/member/disabled", { headers });
            console.log("[AdminDisabledMemberCount.js] getDisabledMemberCount() success.");
            console.log(response.data);
            setDisabledMemberCount(response.data);
        } catch (error) {
            console.log("[AdminDisabledMemberCount.js] getDisabledMemberCount() error.");
            console.log(error);
        }
    };

    return (
        <>
            <div className="icon"><img src="/images/common/icon_disableMem.svg" alt="" /></div>
            <p className="fs_lg mt_md mb_md">비활성화된 회원</p>
            <p className="fs_xlg">{disabledMemberCount} 명</p>
        </>
    );
}

export default AdminMemberEnableCount;
