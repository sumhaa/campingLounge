import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {HttpHeadersContext} from "../context/HttpHeadersProvider";

function AdminCampGetApi(){
    const [rowNum , setRowNum] = useState(0);
    const token = localStorage.getItem("CL_access_token");
    const { headers, setHeaders } = useContext(HttpHeadersContext);
    const getCampApi = async (rowNum)=>{
        try {
            const response = await axios.get(`http://localhost:8080/admin/camp/openapi/${rowNum}`, {headers});
            console.log("[AdminCampGetApi.js] getCampApi() success.");
            alert(`캠핑장 ${rowNum}개를 가져왔습니다.`);
        }catch (error){
            console.log("[[AdminCampGetApi.js] getCampApi() error.");
            console.error("에러 메시지:", error.response?.data || error.message);
        }
    }

    useEffect(() => {
        setHeaders({ "Authorization": `Bearer ${token}` });
    }, []);

    const changeRowNum = (e)=>{
        setRowNum(Number(e.target.value) || 0);
    }

    const requestApi = ()=>{
        if(Number(rowNum) > 0){
            console.log(rowNum);
            getCampApi(rowNum);
        }else {
            alert("가져올 캠핑장 수를 입력해주세요.")
        }
    }
    return(
        <>
            <div className="icon"><img src="/images/common/icon_web.svg" alt=""/>
            </div>
            <p className="fs_lg mt_md mb_md">고캠핑 API 연결</p>
            <div className="item-box">
                <input type="number" className="fs_md" placeholder="가져올 캠핑장 수" onChange={changeRowNum}/>
                <input type="submit" className="fs_md" onClick={requestApi} value="API 요청"/>
                {/*<button className="btn"> Open API 연결</button>*/}
            </div>
        </>
    );
}
export default AdminCampGetApi;

