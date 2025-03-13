import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminSignIn() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [checkPwd, setCheckPwd] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("남자");
    const [tel, setTel] = useState("");
    const [securityKey, setSecurityKey] = useState("");
    const [isValid, setIsValid] = useState(false);

    const navigate = useNavigate();
    const today = new Date();

    const emailDuplicate = async () => {
        try {
            const response = await axios.post("http://localhost:8080/member/emailDuplicate", { email });
            if (!response.data) {
                setIsValid(true);
                alert("사용 가능한 이메일입니다.");
            } else {
                setIsValid(false);
                alert("중복된 이메일입니다.");
            }
        } catch (error) {
            alert("서버와의 연결 오류");
            console.error(error);
        }
    };

    const checkKey = async () => {
        const data = {
            securityKey: securityKey,
        }
        try {
            const response = await axios.post("http://localhost:8080/member/checkKey", data);
            return response.data;
        } catch (e) {
            alert("서버와의 연결 오류 : " + e.response.data.message);
            console.error(e);
        }}

    const join = async (e) => {
        e.preventDefault(); // 기본 폼 제출 방지
        if (!isValid) {
            return alert("이메일 중복 확인을 해주세요.");
        } else if (password !== checkPwd) {
            return alert("비밀번호가 일치하지 않습니다.");
        } else if (!password || !email || !tel) {
            return alert("필수 입력 항목을 모두 입력하세요.");
        } else {
            const isKeyValid = await checkKey();
            if(!isKeyValid){
                return alert("인증코드가 다릅니다.");
            }
        }
        const data = { name, password, email, gender, tel, join_date: today, role: "ADMIN", securityKey };

        try {
            const response = await axios.post("http://localhost:8080/member/join", data);
            if (response.status === 200 || response.status === 201) {
                alert("관리자 등록 완료");
                navigate('/');
            } else {
                alert("관리자 등록 실패 : " + response.data.message);
            }
        } catch (error) {
            alert(error.response?.data?.message || "관리자 등록 실패");
            console.error(error);
        }
    };

    return (
        <main id="main" className="signin">
            <section className="sec">
                <div className="inner_02">
                    <div className="signin-input-wrap">
                        <p className="title tit-md mb_md txt-a-c">관리자 등록</p>
                        <div className="bar bar-lg mb_sm"></div>
                        <p className="fs_md txt-a-r mb_lg">
                            <span className="tc-e fs_lg">*</span> 필수 입력 항목
                        </p>
                        <div className="input_wrap">
                            <form className="signin-form" onSubmit={join}>
                                <div className="item">
                                    <label className="label">
                                        <span className="tc-e fs_lg">*</span> 이메일
                                    </label>
                                    <div className="email-container">
                                        <input type="text" className="input-txt input-max" value={email} placeholder="your@email.com"
                                            onChange={(e) => { setEmail(e.target.value); setIsValid(false); }} />
                                        <button type="button" className="btn btn-p-f btn-sm" onClick={emailDuplicate}>
                                            중복 확인
                                        </button>
                                    </div>
                                </div>
                                <div className="item">
                                    <label className="label">
                                        <span className="tc-e fs_lg">*</span> 비밀번호
                                    </label>
                                    <input type="password" className="input-txt input-max" value={password} placeholder="비밀번호" onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="item">
                                    <label className="label">
                                        <span className="tc-e fs_lg">*</span> 비밀번호 확인
                                    </label>
                                    <input type="password" className="input-txt input-max" value={checkPwd} placeholder="비밀번호 확인" onChange={(e) => setCheckPwd(e.target.value)} />
                                </div>
                                <div className="item">
                                    <label className="label">
                                        <span className="tc-e fs_lg">*</span> 이름
                                    </label>
                                    <input type="text" className="input-txt input-max" value={name} placeholder="홍길동" onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="item">
                                    <label className="label">
                                        <span className="tc-e fs_lg">*</span> 전화번호
                                    </label>
                                    <input type="text" className="input-txt input-max" value={tel} placeholder="숫자만 입력" 
                                           onChange={(e) => setTel(e.target.value.replace(/[^0-9]/g, ""))} required />
                                </div>
                                {/* 인증 코드 입력란을 성별 선택 위로 이동 */}
                                <div className="item">
                                    <label className="label">
                                        <span className="tc-e fs_lg">*</span> 인증코드
                                    </label>
                                    <input type="text" className="input-txt input-max" value={securityKey} placeholder="인증코드" onChange={(e) => setSecurityKey(e.target.value)} required />
                                </div>
                                {/* 성별 선택 */}
                                <div className="item-select">
                                    <label className="label">성별</label>
                                    <select className="select select-md" value={gender} onChange={(e) => setGender(e.target.value)}>
                                        <option value="남자">남자</option>
                                        <option value="여자">여자</option>
                                    </select>
                                </div>
                                {/* 관리자 등록 버튼 - input type="submit"으로 변경 */}
                                <input type="submit" className="submit input-lg" value="관리자 등록" />
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default AdminSignIn;
