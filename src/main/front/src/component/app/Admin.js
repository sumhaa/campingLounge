import "../../css/admin.css";
import React, {useContext, useEffect, useState} from "react";
import AdminProfile from "../adminComponent/AdminProfile";
import AdminDashBoard from "../adminComponent/AdminDashBoard";
import {HttpHeadersContext} from "../context/HttpHeadersProvider";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import AdminMemberBoard from "../adminComponent/AdminMemberBoard";
import {AuthContext} from "../context/AuthProvider";
import AdminCampBoard from "../adminComponent/AdminCampBoard";
import AdminTabBoard from "../adminComponent/AdminTabBoard";

function Admin({setAdminMode}){
    const [loginUserId, setLoginUserId] = useState(localStorage.getItem("id"));
    const [ role, setRole ] = useState(localStorage.getItem("role"));
    const { headers, setHeaders } = useContext(HttpHeadersContext);
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    console.log(role);
    const [workSpace, setWorkSpace] = useState("");
    const changeWorkSpace = (param)=>{
            setWorkSpace(param);
    }
    useEffect(() => {
        if (!auth || role !== "ADMIN"){
            alert("관리자 전용 페이지입니다.")
            navigate('/');
        }
    }, [auth]);
    useEffect(() => {
        setWorkSpace("dashBoard");
    }, []);

    useEffect(() => {
        setAdminMode(true);
        return()=>setAdminMode(false)
    }, []);

    useEffect(() => {
        setHeaders({
            "Authorization": `Bearer ${localStorage.getItem("CL_access_token")}`
        });
    }, []);

    const token = localStorage.getItem("CL_access_token");

    return(
        <>
            <main id="main" className="admin">
                <div id="container" className="container">
                    <div className="inner_00">
                        <aside id="side-menu">
                            <div className="component">
                                <h3 className="fs_xlg">관리 메뉴</h3>
                                <nav>
                                    <ul>
                                        <li className={workSpace === "dashBoard" ? "active" : null}><p
                                            className="fs_lg"><Link onClick={()=> changeWorkSpace("dashBoard")}>대시보드</Link></p></li>
                                        <li className={workSpace === "memberBoard" ? "active" : null}><p
                                            className="fs_lg"><Link onClick={() => changeWorkSpace("memberBoard")}>회원 관리</Link></p>
                                        </li>
                                        <li className={workSpace === "campBoard" ? "active" : null}><p
                                            className="fs_lg"><Link onClick={() => changeWorkSpace("campBoard")}>캠핑장 관리</Link></p>
                                        </li>
                                        <li className={workSpace === "resBoard" ? "active" : null}><p className="fs_lg">
                                            <Link onClick={() => changeWorkSpace("resBoard")}>예약 관리</Link></p></li>
                                        <li className={workSpace === "reviewBoard" ? "active" : null}><p
                                            className="fs_lg"><Link onClick={() => changeWorkSpace("reviewBoard")}>리뷰 관리</Link></p>
                                        </li>
                                        <li className={workSpace === "commentBoard" ? "active" : null}><p
                                            className="fs_lg"><Link onClick={() => changeWorkSpace("commentBoard")}>댓글 관리</Link></p>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div className="component">
                            <AdminProfile loginUserId={loginUserId}/>
                            </div>
                        </aside>
                        <article>
                            {workSpace === "dashBoard" ? (
                                <AdminDashBoard loginUserId={loginUserId}/>
                            ): workSpace === "memberBoard" ? (
                                <AdminMemberBoard loginUserId={loginUserId}/>
                            ): workSpace === "campBoard" ? (
                                <AdminCampBoard />
                            ): workSpace === "resBoard" ? (
                                <AdminTabBoard selected={"resBoard"}/>
                            ): workSpace === "reviewBoard" ? (
                                <AdminTabBoard selected={"reviewBoard"}/>
                            ): workSpace === "commentBoard" ? (
                                <AdminTabBoard selected={"commentBoard"}/>
                            ): null
                            }
                        </article>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Admin;