import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

import "../../css/style.css";
import "../../css/login.css";
import GoogleLoginBtn from "../GoogleLoginBtn";
import {useCookies} from "react-cookie";

function Login() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    const { auth, setAuth } = useContext(AuthContext);
    const { headers, setHeaders } = useContext(HttpHeadersContext);
    const [cookies, setCookie, removeCookie] = useCookies(["loggedIn"]);

    useEffect(() => {
        // 이미 로그인 한 상태면 마이페이지로 이동
        if(auth) {
            navigate(`/memberDetail/${localStorage.getItem("id")}`);
        }
    }, []); // 컴포넌트가 처음 렌더링될 때 실행

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

    return (
        <main id="main" className="member-update">
            <section className="sec">
                <div className="inner_02">
                    <div className="member-update-wrap">
                        <p className="title tit-md mb_md txt-a-c">캠핑라운지</p>
                        <p className="fs_xlg txt-a-c tc-p">Login</p>
                        <div className="bar bar-lg mb_lg mt_sm"></div>
                        <div className="input-wrap">
                            <form onSubmit={login} className="member-update-form">
                                <div className="item">
                                    <label htmlFor="email" className="label">이메일</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="input-txt input-max"
                                        value={email}
                                        placeholder="이메일"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="item">
                                    <label htmlFor="password" className="label">비밀번호</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="input-txt input-max"
                                        value={password}
                                        placeholder="비밀번호"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <input type="submit" className="submit input-lg" value="이메일로 로그인" />
                                <GoogleLoginBtn />
                            </form>
                            <br/>



                            <div className="bar bar-md mt_md mb_lg pt-md"></div>

                            <div className="link-box">
                                <button
                                    className="btn btn-s btn-lg mlr-a tc-w"
                                    onClick={() => navigate("/signIn")}>
                                    회원 가입
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </main>
    );
}



export default Login;