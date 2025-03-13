import {useContext, useEffect, useState} from "react";
import {HttpHeadersContext} from "../context/HttpHeadersProvider";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {AuthContext} from "../context/AuthProvider";

function MemberArea({user, setUser}) {
    const memberId = useParams();
    const { headers, setHeaders } = useContext(HttpHeadersContext);
    const { auth, setAuth } = useContext(AuthContext);
    const [loginUserId, setLoginUserId] = useState(localStorage.getItem("id"));
    const [targetId, setTargetId] = useState(localStorage.getItem("id2"));
    const [profilePath, setProfilePath] = useState("");

    const navigate = useNavigate();

    const logout = () => {
        if(window.confirm("정말 로그아웃 하시겠습니까?"))
            {
                setHeaders(null);
                setAuth(null);
                localStorage.clear();

                navigate("/");
            }

    }

    useEffect(() => {
        setTargetId(localStorage.getItem("id2"));
    }, []);

    const memberUpdate = () => {
        navigate("/update");
    }

//    const goToChatList = () => {
//        navigate("/chatList");
//    };

    const goToChat = async () => {
        const updatedTargetId = targetId || localStorage.getItem("id2"); // localStorage에서 가져오기


        if (!loginUserId || !updatedTargetId) {
            console.error("유효하지 않은 사용자");
            return;
        }

        try {
            await axios.post("http://localhost:8080/chat/start", {
                userId: loginUserId,
                targetId: updatedTargetId
            });

            navigate("/chat");
            //navigate("/chatList");
        } catch (error) {
            console.error("채팅 시작 오류:", error);
        }
    };


    useEffect(() => {
        //새로고침(F5) 후에도 로그인 상태를 유지하기 할 수 있고, 만약 새로 로그인 한다면 로그인 후 새로운 JWT 토큰을 반영할 수 있다
        setHeaders({
            "Authorization": `Bearer ${localStorage.getItem("CL_access_token")}`
        });

        axios.get(`http://localhost:8080/member/user/${memberId.memberId}`, {headers: headers})
            .then(response => {
                setUser(response.data);
                if (response.data.email !== localStorage.getItem("email")) {
                    localStorage.setItem("chatTarget", response.data.email);
                    localStorage.setItem("userEmail", localStorage.getItem("email"));
                    localStorage.setItem("id2", response.data.id);
                    localStorage.setItem("targetName", response.data.name);
                } else {
                    localStorage.setItem("chatTarget", "");
                    localStorage.setItem("userEmail", "");
                    localStorage.setItem("id2", "");
                    localStorage.setItem("targetName", "");
                }
            })
            .catch(error => {
                console.error("사용자 정보를 가져오는 중 오류 발생:", error);
                alert("사용자 정보가 없습니다.");
                setHeaders(null);
                setAuth(null);
                localStorage.clear();

                navigate("/");
            });
    }, []);

    // 프로필 경로 가져오기
    useEffect(() => {
        if (user && user.profile) {
            axios.get(`http://localhost:8080/member/getProfile/${user.id}`, {headers: headers})
                .then(response => {
                    setProfilePath(response.data);
                })
                .catch(error => {
                    console.error("프로필 경로를 가져오는 중 오류 발생 : ", error);
                })
        }
    }, [user]);

   return (<article className="member-area">
        <div className="wrap">
            <div className="profile-area">
                <div className="profile">
                    {user.profile ? <img src={"http://localhost:8080/uploads/" + profilePath} alt="프로필 이미지" style={{display:"flex", borderRadius:"50%"}}/>  : user.profile_url ? <img src={user.profile_url} alt="프로필 이미지" style={{display:"flex", borderRadius:"50%"}}/> : ""}
                </div>
                <div className="name-wrap">
                    <p className="name">{user.name ? user.name : "GUEST"}</p>
                </div>
            </div>

            <div className="member-info-area">
                {user.id === Number(loginUserId) ? <ul className="member-info">
                    {user.email ? <li><p>{user.email}</p></li> : ""}
                    {user.tel ? <li><p>{user.tel}</p></li> : ""}
                    {user.address ? <li><p>{user.address}</p></li> : ""}
                    <li>
                        <p>{user.join_date ? `가입일 : ${new Date(user.join_date).toLocaleDateString()}` : "가입일"}</p>
                    </li>
                </ul> : ""}

                <div className="btn-box">
                    {user.id === Number(loginUserId) ? (
                        <>
	                        <div><Link to={"/update"}>
		                        <button className="btn btn-lg btn-p">회원정보 수정</button>
		                    </Link><br/>
		                        <button className="btn btn-lg btn-s" onClick={logout}>로그아웃</button>
		                    </div>
                        </>
                    ) : (
                        <button className="btn btn-lg btn-p" onClick={goToChat}>채팅하기</button>
                    )}
                </div>
            </div>
        </div>
    </article>);
}

export default MemberArea;