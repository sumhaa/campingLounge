import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {HttpHeadersContext} from "../context/HttpHeadersProvider";
import {AuthContext} from "../context/AuthProvider";
import axios from "axios";

function AdminProfile({loginUserId}){
    const {headers, setHeaders} = useContext(HttpHeadersContext);
    const { auth, setAuth } = useContext(AuthContext);
    const [user, setUser] = useState("");
    const [profilePath, setProfilePath] = useState("");

    const navigate = useNavigate();

    const [startTime, setStartTime] = useState(() => {
        return localStorage.getItem("startTime")
            ? parseInt(localStorage.getItem("startTime"), 10)
            : Date.now();
    });

    const [useTime, setUseTime] = useState(0);

    useEffect(() => {
        // 시작 시간을 localStorage에 저장
        localStorage.setItem("startTime", startTime);

        const interval = setInterval(() => {
            setUseTime(Date.now() - startTime);
        }, 1000);

        return () => {
            clearInterval(interval);
            // 페이지를 떠날 때 startTime 제거
            localStorage.removeItem("startTime");
        };
    }, [startTime]);
    
    const formatTime = (time) => {
        const total = Math.floor(time / 1000);
        const hours = String(Math.floor(total / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
        const seconds = String(total % 60).padStart(2, "0");

        return `${hours}:${minutes}:${seconds}`;
    };

    const logout = () => {
        setHeaders(null);
        setAuth(null);
        localStorage.removeItem("CL_access_token");
        localStorage.removeItem("email");
        localStorage.removeItem("id");
        alert("로그아웃 성공");
        navigate("/");
    }

    useEffect(() => {
        //새로고침(F5) 후에도 로그인 상태를 유지하기 할 수 있고, 만약 새로 로그인 한다면 로그인 후 새로운 JWT 토큰을 반영할 수 있다
        setHeaders({
            "Authorization": `Bearer ${localStorage.getItem("CL_access_token")}`
        });

        axios.get(`http://localhost:8080/member/user/${loginUserId}`, {headers: headers})
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error("사용자 정보를 가져오는 중 오류 발생:", error);
            });
    }, []);

    return(
        <>
            <h3 className="fs_xlg">관리자 정보</h3>
            <div className="table_wrap mb_md">
                <table>
                    <tbody>
                    <tr>
                        <td className="tc-p">이메일</td>
                        <td>{user.email}</td>
                    </tr>
                    <tr>
                        <td className="tc-p">이름</td>
                        <td>{user.name}</td>
                    </tr>
                    <tr>
                        <td className="tc-p">접속 시간</td>
                        <td>{formatTime(useTime)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <button className="btn btn-s-l btn-sm mlr-a" onClick={logout}>로그아웃</button>
        </>
    );
}

export default AdminProfile;