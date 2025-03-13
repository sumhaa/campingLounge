import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";
import "../../css/member-update.css";
import Address from "../Address";
import {AuthContext} from "../context/AuthProvider";

function MemberUpdate({setProfileChange}) {
    const { auth, setAuth } = useContext(AuthContext);
    const { headers, setHeaders } = useContext(HttpHeadersContext);
    const navigate = useNavigate();

    const [user, setUser] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [checkPwd, setCheckPwd] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [tel, setTel] = useState("");
    const [file, setFile] = useState(null);
    const [address, setAddress] = useState("");
    const [address_detail, setAddress_detail] = useState("");
    const [postcode, setPostcode] = useState("");
    const [profilePath, setProfilePath] = useState("");
    const [profileUrl, setProfileUrl] = useState("");

    useEffect(() => {
        setHeaders({
            "Authorization": `Bearer ${localStorage.getItem("CL_access_token")}`
        });

        axios.get("http://localhost:8080/member/me", { headers })
            .then(response => {
                setUser(response.data);
                setName(response.data.name);
                setEmail(response.data.email);
                setGender(response.data.gender);
                setTel(response.data.tel);
                setPostcode(response.data.postcode);
                setAddress(response.data.address);
                setAddress_detail(response.data.address_detail);
                setProfileUrl(response.data.profile_url);
            })
            .catch(error => console.error("사용자 정보를 가져오는 중 오류 발생:", error));
    }, []);

    useEffect(() => {
        if (user && user.profile) {
            axios.get(`http://localhost:8080/member/getProfile/${user.id}`, { headers })
                .then(response => {
                    setProfilePath("http://localhost:8080/uploads/" + response.data);
                })
                .catch(error => {
                    console.error("프로필 경로를 가져오는 중 오류 발생:", error);
                });
        }
    }, [user]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);

            // 파일 미리보기 URL 생성
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfilePath(event.target.result); // 미리보기 이미지 설정
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const uploadFile = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        try {
            await axios.post("http://localhost:8080/member/upload", formData, { headers });
        } catch (error) {
            alert("파일 업로드 실패: " + error);
        }
    };

    const updateMember = async (e) => {
        e.preventDefault();

        const data = { name, tel, password, postcode, address, address_detail, profile: file ? true : !!profilePath };
        try {
            const response = await axios.put("http://localhost:8080/member/update", data, { headers });
            if (file) await uploadFile();

            if (response.status === 200 || response.status === 201) {
                setProfileChange(true);
                alert("회원 정보 수정 성공");
                navigate(-1);
            } else {
                alert("회원 정보 수정 실패");
            }
        } catch (error) {
            alert("서버 오류 발생");
        }
    };

    const userUnable = async () => {
        try {
            if(window.confirm("정말 탈퇴하시겠습니까?")){
                await axios.get("http://localhost:8080/member/unable", {headers: headers});
                setHeaders(null);
                setAuth(null);
                localStorage.removeItem("CL_access_token");
                localStorage.removeItem("email");
                localStorage.removeItem("id");
                alert("회원탈퇴 성공");
                navigate("/");
            }

        } catch (e) {
            alert(e);
        }
    }

    return (
        <main id="main" className="member-update">
            <section className="sec">
                <div className="inner_02">
                    <div className="member-update-wrap">
                        <p className="title tit-md mb_md txt-a-c">회원 정보 수정</p>
                        <div className="bar bar-lg mb_lg"></div>
                        <form onSubmit={updateMember} className="member-update-form">
                            <div className="item">
                                <div className="profile-thumb">
                                    {profilePath ?
                                        <img src={profilePath} alt="프로필 이미지" style={{display: "flex"}}/> : profileUrl ?
                                            <img src={profileUrl} alt="프로필 이미지" style={{display: "flex"}}/> : ""}
                                </div>
                                <label className="label">프로필 이미지</label>
                                <input type="file" onChange={handleFileChange} className="input-file input-max"/>
                            </div>
                            {!profileUrl ? <div className="item">
                                <label className="label">
                                    <span className="tc-e fs_lg">*</span>비밀번호 수정
                                </label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                       className="input-txt input-max"/>
                            </div> : ""}
                            {!profileUrl ? <div className="item">
                                <label className="label">
                                    <span className="tc-e fs_lg">*</span>비밀번호 확인
                                </label>
                                <input type="password" value={checkPwd} onChange={(e) => setCheckPwd(e.target.value)}
                                       className="input-txt input-max"/>
                            </div> : ""}
                            <div className="item">
                                <label className="label">
                                    <span className="tc-e fs_lg">*</span>이름
                                </label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                       placeholder="홍길동" className="input-txt input-max" required/>
                            </div>
                            <div className="item">
                                <label className="label">
                                    <span className="tc-e fs_lg">*</span>전화번호
                                </label>
                                <input type="text" value={tel} onChange={(e) => setTel(e.target.value)}
                                       className="input-txt input-max" required/>
                            </div>
                            <div className="item">
                                <label className="label">주소</label>
                                <div className="add-box">
                                    <input type="text" className="input-txt input-sm" placeholder="우편번호"
                                           value={postcode} readOnly/>
                                    <Address setAddress={setAddress} setPostcode={setPostcode}/>
                                </div>
                                <input type="text" className="input-txt input-max" placeholder="도로명 주소" value={address}
                                       readOnly/>
                                <input type="text" className="input-txt input-max mt_sm" placeholder="상세 주소"
                                       value={address_detail} onChange={(e) => setAddress_detail(e.target.value)}/>
                            </div>
                            <input type="submit" value="회원 정보 수정" className="submit input-lg"/>
                            <button type="button" className="btn btn-e-l btn-lg" onClick={userUnable}>회원 탈퇴</button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default MemberUpdate;