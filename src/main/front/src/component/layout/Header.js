import {Link} from "react-router-dom";
import "../../css/layout.css";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {HttpHeadersContext} from "../context/HttpHeadersProvider";
import {AuthContext} from "../context/AuthProvider";
import {preventDefault} from "leaflet/src/dom/DomEvent";

function Header({adminMode, mainPage,setMainLayoutChange, profileChange, setProfileChange}) {
    const [isActive, setIsActive] = useState(false);
    const [mainLoginOpen, setMainLoginOpen] = useState(false);
    let lastScrollTop = 0;
    const delta = 5;

    function scrollEffect(){
        if(!adminMode) {
            let didScroll = false;

            const handleScroll = () => {
                didScroll = true;
            };

            const checkScroll = () => {
                if (didScroll) {
                    hasScrolled();
                    didScroll = false;
                }
            };

            const hasScrolled = () => {
                const nowScrollTop = window.scrollY;
                if (Math.abs(lastScrollTop - nowScrollTop) <= delta) {
                    return;
                }

                if (nowScrollTop > lastScrollTop && nowScrollTop >= 10) {
                    // 스크롤 내릴 때
                    setIsActive(true);
                }
                if (nowScrollTop <= 100) {
                    // 스크롤 올릴 때
                    setIsActive(false);
                }

                lastScrollTop = nowScrollTop;
            };

            window.addEventListener("scroll", handleScroll);
            const interval = setInterval(checkScroll, 250);

            return () => {
                window.removeEventListener("scroll", handleScroll);
                clearInterval(interval);
            };
        }
    }

    useEffect(() => {
        scrollEffect();
    }, []);

    const {headers, setHeaders} = useContext(HttpHeadersContext);
    const { auth, setAuth } = useContext(AuthContext);
    const [memberId, setMemberId] = useState(localStorage.getItem("id"));
    const [user, setUser] = useState("");
    const [profilePath, setProfilePath] = useState("");


    // auth 가 바뀌면 memberId 변경
    useEffect(() => {
        setMemberId(localStorage.getItem("id"));
    }, [auth]);

    useEffect( () => {

        if(memberId) {
            axios.get(`http://localhost:8080/member/user/${memberId}`, {headers: headers})
                .then(response => {
                    setUser(response.data);
                })
                .catch(error => {
                    console.error("사용자 정보를 가져오는 중 오류 발생:", error);
                });
        } else {
            setUser([]);
        }

    }, [memberId, profileChange]);

    // 프로필 경로 가져오기
    useEffect( () => {

        if (user && user.profile) {
            axios.get(`http://localhost:8080/member/getProfile/${memberId}`, {headers: headers})
                .then(response => {
                    setProfilePath(response.data);
                    setProfileChange(false);
                })
                .catch(error => {
                    console.error("프로필 경로를 가져오는 중 오류 발생 : ", error);
                })
        }
    }, [user]);

    useEffect(() => {
        setMainLayoutChange(false);
        setMainLoginOpen(false);
    }, [mainPage]);

    const changeMainLayout =()=>{
        setMainLayoutChange(prev => !prev);
        setMainLoginOpen(prev => !prev);
    }

    return (
        <>
         {!adminMode ? (
             <header id="header" className={`header ${isActive ? "active" : ""} ${mainPage ? "mainHeader" : ""} ${mainLoginOpen ? "mainLoginOpen" : ""}`.trim()}>
                 <div className="header_inner">
                     <div className="logo_wrap">
                         <h1 className="logo">
                             <Link to={'/'}>캠핑라운지</Link>
                         </h1>
                     </div>
                     {/*// <!--logo_wrap-->*/}
                     <nav id="nav">
                         <ul>
                             <li><Link to={'/camp'}>캠핑장 검색</Link></li>
                             <li><Link to={'/review/list'}>리뷰 모아보기</Link></li>
                             {/*<li><Link to={'/weather'}>오늘의 날씨</Link></li> */}
                             <li><Link to={'/chatList'}>채팅 목록</Link></li>
                         </ul>
                         <div className="login-btn" style={{overflow: "hidden"}}>
                             <Link to={'/login'} onClick={ mainPage ?
                                 ((e) => {
                                     e.preventDefault()
                                     changeMainLayout()
                                 })
                                 : null
                             }>
                                 {user.profile ?
                                 <img src={"http://localhost:8080/uploads/" + profilePath} alt="프로필 이미지"
                                      style={{filter: "grayscale(0) invert(0)", width: "3rem", height: "3rem", borderRadius: "50%",}}/>
                                 : user.profile_url ?
                                     <img src={user.profile_url} alt="프로필 이미지"
                                          style={{filter: "grayscale(0) invert(0)", width: "3rem", height: "3rem", borderRadius: "50%"}}/>
                                 :
                                     <img src="/images/common/icon_login.svg" alt="로그인"/>}
                             </Link>
                         </div>
                     </nav>
                 </div>
                 {/*// <!--header_inner-->*/}
             </header>
        ) : (
            <header id="header" className="admin-header active">
             <div className="header_inner">
                 <div className="logo_wrap">
                     <h1 className="logo">
                         <Link to={'/'}

                         >
                             캠핑라운지
                         </Link>
                         <span className="fs_md tc-p">관리자 페이지</span>
                     </h1>
                 </div>
             </div>
            </header>
         )}
        </>
    );
}

export default Header;