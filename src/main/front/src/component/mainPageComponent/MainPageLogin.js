import GoogleLoginBtn from "../GoogleLoginBtn";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthProvider";
import {HttpHeadersContext} from "../context/HttpHeadersProvider";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useCookies} from "react-cookie";

function MainPageLogin(){
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const { auth, setAuth } = useContext(AuthContext);
    const { headers, setHeaders } = useContext(HttpHeadersContext);
    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();

        const data = { email, password };

        try {
            const response = await axios.post(
                "http://localhost:8080/member/login",
                data
            );

            if (response.status === 200 || response.status === 201) {
                alert("로그인 성공");
                const user_role = response.data.role;

                localStorage.setItem("CL_access_token", response.data.token);
                localStorage.setItem("email", response.data.email);
                localStorage.setItem("id", response.data.id);
                localStorage.setItem("role", response.data.role);
                localStorage.setItem("name", response.data.name);
                setCookie("loggedIn", true);

                setAuth(response.data.email);
                setHeaders({ "Authorization": `Bearer ${response.data.token}` });

                if (user_role === "ADMIN") {
                    navigate("/admin");
                } else {
                    navigate(`/memberDetail/${response.data.id}`);
                }
            } else {
                alert("로그인 실패: " + response.data.message);
            }
        } catch (error) {
            alert(error.response?.data?.error || error.response?.data || "로그인 실패");
            console.error("로그인 오류:", error);
        }
    };

    //유저 정보 가져오기

    const [user, setUser] = useState("");

    useEffect(() => {
        //새로고침(F5) 후에도 로그인 상태를 유지하기 할 수 있고, 만약 새로 로그인 한다면 로그인 후 새로운 JWT 토큰을 반영할 수 있다
        setHeaders({
            "Authorization": `Bearer ${localStorage.getItem("CL_access_token")}`
        });

        axios.get(`http://localhost:8080/member/user/${localStorage.getItem("id")}`, {headers: headers})
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error("사용자 정보를 가져오는 중 오류 발생:", error);
            });

    }, []);

    // 프로필 경로 가져오기

    const [profilePath, setProfilePath] = useState("");

    useEffect(() => {
        if (auth) {
            axios.get(`http://localhost:8080/member/getProfile/${localStorage.getItem("id")}`, {headers: headers})
                .then(response => {
                    setProfilePath(response.data);
                })
                .catch(error => {
                    console.error("프로필 경로를 가져오는 중 오류 발생 : ", error);
                    setProfilePath(null);
                })
        }
    }, [auth,localStorage]);

    // 로그아웃

    const logout = () => {
        setHeaders(null);
        setAuth(null);
        setProfilePath(null);
        setUser([]);
        localStorage.clear();

        navigate("/");
    }

    const [cookies, setCookie, removeCookie] = useCookies(["loggedIn"]);

    const loadHandler = () => {
        if(!cookies.loggedIn) {
            setHeaders(null);
            setAuth(null);
            setProfilePath(null);
            setUser([]);
            localStorage.clear();
        }
    }

    window.addEventListener("load", loadHandler);

    return (
        <div className="login_wrap">
            <div className="login_inner">
                <div className="login-box">
                    <div className="login-cir">
                        {user.profile ?
                            <img src={"http://localhost:8080/uploads/" + profilePath} alt="프로필 이미지" /> : user.profile_url ? <img src={user.profile_url} alt="프로필 이미지"/> : ""}
                    </div>
                    {auth ?
                        (<p className="name-wrap fs_lg">
                            {user.name}
                        </p>) : (
                            <p className="fs_xlg txt-a-c mt_sm">
                                Login
                            </p>
                        )}
                </div>
                <div className="login-input-wrap">
                {!auth ? <div className="input_wrap">
                        <form onSubmit={login} action="" method="post" className="login-form">
                            <input type="text" className="input-txt input-lg" value={email}
                                   onChange={(e) => setEmail(e.target.value)} placeholder="이메일"/>
                            <input type="password" className="input-txt input-lg" value={password}
                                   onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호"/>
                            <input type="submit" className="submit input-lg" value="로그인"/>
                            <GoogleLoginBtn/>
                        </form>
                        <div className="bar bar-md mt_lg mb_md"></div>
                        <button className="btn btn-s btn-lg mlr-a"><a className="tc-w" href="/signIn">회원
                            가입</a></button>
                    </div> : <div>
                        <ul className="member-info">
                            <li><p className="fs_lg txt-a-c mt_sm">{user.email ? user.email : "이메일"}</p></li>
                            <li><p className="fs_lg txt-a-c mt_sm">{user.tel ? user.tel : "연락처 없음"}</p></li>
                            <li><p className="fs_lg txt-a-c mt_sm">{user.address ? user.address : "주소 정보 없음"}</p></li>
                        </ul>
                        <button className="btn btn-p btn-lg mlr-a" onClick={() => {
                            navigate(`/memberDetail/${user.id}`)
                        }}>마이 페이지
                        </button>
                        <br/>
                        <button className="btn btn-s btn-lg mlr-a" onClick={logout}>로그아웃</button>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default MainPageLogin;