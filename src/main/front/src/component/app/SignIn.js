import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Address from "../Address";
import "../../css/style.css";
import "../../css/signin.css";
import PrivacyPolicy from "../context/PrivacyPolicy";

function SignIn() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [checkPwd, setCheckPwd] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("남자"); // 기본값 "남자"
    const [tel, setTel] = useState("");
    const [postcode, setPostcode] = useState(""); // 우편번호
    const [address, setAddress] = useState(""); // 도로명 주소
    const [address_detail, setAddress_detail] = useState(""); // 상세 주소

    const [isValid, setIsValid] = useState(false);
    const navigate = useNavigate();
    const today = new Date();

    // 이메일 중복 확인
    const emailDuplicate = async () => {
        const data = { email };

        try {
            const isEmailExist = await axios.post("http://localhost:8080/member/emailDuplicate", data);
            if (!isEmailExist.data) {
                setIsValid(true);
                alert("사용 가능한 이메일 입니다.");
            } else {
                setIsValid(false);
                alert("중복된 이메일 입니다.");
            }
        } catch (error) {
            alert("서버와의 연결 오류");
            console.error(error);
        }
    };

    // 회원가입 요청
    const join = async (e) => {
        e.preventDefault();
        const data = {
            name,
            password,
            email,
            gender,
            tel,
            join_date: today,
            role: "USER",
            address,
            address_detail,
            postcode,
        };

        if (!isValid) {
            alert("이메일 중복확인을 해주세요.");
        } else if (password !== checkPwd) {
            alert("비밀번호와 비밀번호 확인이 다릅니다.");
        } else if (!password || !email || !tel) {
            alert("필수 입력 칸을 입력해주세요.");
        } else {
            try {
                const response = await axios.post("http://localhost:8080/member/join", data);
                if (response.status === 200 || response.status === 201) {
                    alert("회원가입 성공");
                    navigate("/");
                } else {
                    alert("회원가입 실패: " + response.data.message);
                }
            } catch (error) {
                alert("서버와의 연결 오류");
                console.error(error);
            }
        }
    };

    return (
        <main id="main" className="signin">
            <section className="sec">
                <div className="inner_02">
                    <div className="signin-input-wrap">
                        <p className="title tit-md mb_md txt-a-c">회원 가입</p>
                        <div className="bar bar-lg mb_sm"></div>
                        <p className="fs_md txt-a-r mb_lg">
                            <span className="tc-e fs_lg">*</span> 은 필수 입력 항목입니다.
                        </p>
                        <form onSubmit={join} className="signin-form">
                            {/* 이메일 입력 */}
                            <div className="item">
                                <label className="label">
                                    <span className="tc-e fs_lg">*</span> 이메일
                                </label>
                                <div className="email-container">
                                    <input type="email" className="input-txt input-max"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setIsValid(false);
                                        }}
                                        required
                                    />
                                    <button type="button" className="btn btn-p-f btn-sm" onClick={emailDuplicate}>
                                        중복 확인
                                    </button>
                                </div>
                            </div>

                            {/* 비밀번호 입력 */}
                            <div className="item">
                                <label className="label">
                                    <span className="tc-e fs_lg">*</span> 비밀번호
                                </label>
                                <input type="password" className="input-txt input-max"
                                    placeholder="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="item">
                                <label className="label">
                                    <span className="tc-e fs_lg">*</span> 비밀번호 확인
                                </label>
                                <input type="password" className="input-txt input-max"
                                    placeholder="password check"
                                    value={checkPwd}
                                    onChange={(e) => setCheckPwd(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="item">
                                <label className="label">
                                    <span className="tc-e fs_lg">*</span> 이름
                                </label>
                                <input type="text" className="input-txt input-max" value={name} placeholder="홍길동" onChange={(e) => setName(e.target.value)} required />
                            </div>
                            
                            {/* 전화번호 입력 */}
                            <div className="item">
                                <label className="label">
                                    <span className="tc-e fs_lg">*</span> 전화번호
                                </label>
                                <input
                                    type="text"
                                    className="input-txt input-max"
                                    placeholder="숫자만 입력"
                                    value={tel}
                                    onChange={(e) => {
                                        const onlyNums = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 필터링
                                        setTel(onlyNums);
                                    }}
                                    required
                                />
                            </div>

                            {/* 주소 입력 */}
                            <div className="item">
                                <label className="label">주소</label>
                                <div className="add-box">
                                    <input
                                        type="text"
                                        className="input-txt input-sm"
                                        placeholder="우편번호"
                                        value={postcode}
                                        readOnly
                                    />
                                    <Address setAddress={setAddress} setPostcode={setPostcode} />
                                </div>
                                <input
                                    type="text"
                                    className="input-txt input-max"
                                    placeholder="도로명 주소"
                                    value={address}
                                    readOnly
                                />
                                <input
                                    type="text"
                                    className="input-txt input-max mt_sm"
                                    placeholder="상세 주소"
                                    value={address_detail}
                                    onChange={(e) => setAddress_detail(e.target.value)}
                                />
                            </div>

                            {/* 성별 선택 */}
                            <div className="item-select">
                                <label htmlFor="gender" className="label">성별</label>
                                <select
                                    name="gender"
                                    id="gender"
                                    className="select select-md"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="남자">남자</option>
                                    <option value="여자">여자</option>
                                </select>
                            </div>

                            {/* 회원가입 버튼 */}
                            <input type="submit" className="submit input-lg" value="회원 가입" />
                        </form>

                        {/* 개인정보 처리 방침 추가 */}
                        <div className="info">
                            <PrivacyPolicy />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default SignIn;