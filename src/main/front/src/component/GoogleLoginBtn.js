import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import axios from "axios";
import {useContext} from "react";
import {AuthContext} from "./context/AuthProvider";
import {HttpHeadersContext} from "./context/HttpHeadersProvider";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";

function GoogleLoginBtn() {

    const { auth, setAuth } = useContext(AuthContext);
    const { headers, setHeaders } = useContext(HttpHeadersContext);
    const [cookies, setCookie, removeCookie] = useCookies(["loggedIn"]);

    const navigate = useNavigate();

    const handleOnSuccess = async (response) => {
        const token = response.credential;

        try {
            const response = await axios.post("http://localhost:8080/member/auth/google", {token: token});

            if (response.status === 200 || response.status === 201) {
                alert("로그인 성공");

                localStorage.setItem("CL_access_token", response.data.token);
                localStorage.setItem("email", response.data.email);
                localStorage.setItem("id", response.data.id);
                setCookie("loggedIn", true);

                setAuth(response.data.email);
                setHeaders({ "Authorization": `Bearer ${response.data.token}` });

                navigate(`/memberDetail/${response.data.id}`);

            } else {
                alert("로그인 실패: " + response.data.message);
            }
        } catch (e) {
            alert(e.response?.data?.error || e.response?.data || "로그인 실패");
            console.error("로그인 오류: ", e);
        }
    }

    const handleOnError = () => {
        console.error("Google 로그인 실패");
    }

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID} >
            <GoogleLogin onSuccess={handleOnSuccess} onError={handleOnError} />
        </GoogleOAuthProvider>
    )
}

export default GoogleLoginBtn;