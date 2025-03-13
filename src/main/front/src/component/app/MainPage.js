import "../../css/main.css";
import {useEffect, useState, useRef, useContext, useTransition} from "react";
import {SwiperSlide, Swiper} from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthProvider";
import {HttpHeadersContext} from "../context/HttpHeadersProvider";
import {useCookies} from "react-cookie";
import GoogleLoginBtn from "../GoogleLoginBtn";
import MainPageLogin from "../mainPageComponent/MainPageLogin";
import MainPageCampItem from "../mainPageComponent/MainPageCampItem";
import MainPageReviewItem from "../mainPageComponent/MainPageReviewItem";


function MainPage({setMainPage, mainLayoutChange}){
    const [campList, setCampList] = useState([]);
    const [bestReviews, setBestReviews] = useState([]);

    const swiperRef = useRef(null);
    const lineBannerTxt = "CampingLounge. made by Kim Seongwoo, Yang Chansik, Son Suyong, Choi Sumin. This webpage is not used for any purpose other than learning."

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const { auth, setAuth } = useContext(AuthContext);
    const { headers, setHeaders } = useContext(HttpHeadersContext);
    const token = localStorage.getItem("CL_access_token");

    const navigate = useNavigate();
    useEffect(() => {
        setMainPage(true);
        return()=>setMainPage(false)
    }, []);



    const getCampList = async (page)=>{
        try {
            const response = await axios.get(`http://localhost:8080/camp`,{params: {"page": page - 1}});

            console.log("[MainPage.js] getCampList() success.");
            console.log(response.data);
            setCampList(response.data.content);
            console.log(campList);

        }catch (error){
            console.log("[CampList.js] getCampList() error.");
            console.log(error);
        }
    }
    useEffect(() => {
        getCampList(1);
    }, []);

    const fetchBestReviews = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/review/best?page=0&size=5` // 한 페이지에 5개 베스트 리뷰 요청
            );
            console.log("[MainPage.js] fetchBestReviews() success.");
            setBestReviews(response.data.content); // 베스트 리뷰 데이터를 상태에 저장
            console.log(response.data.content)
        } catch (error) {
            console.error('베스트 리뷰 불러오기 오류:', error);
        }
    };

    useEffect(() => {
        fetchBestReviews();
    }, []);

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
        setHeaders({ "Authorization": `Bearer ${token}` });

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
        if(window.confirm("정말 로그아웃 하시겠습니까?")){
            setHeaders(null);
            setAuth(null);
            setProfilePath(null);
            setUser([]);
            localStorage.clear();

            navigate("/");
        }

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


    return(
        <>
            <div id="screen" className={mainLayoutChange ? "active" : ""}>
                <div className="container_m">
                    <main id="main" className="main">
                        <section className="sec visual">
                            <div className="visual_wrap">
                                <div className="inner_00">
                                    <div className="txt-area">
                                        <Link to="/camp" className="hover_up01" style={{display:"flex"}}>
                                            <h2 className="visual_title ani_txt-fade-up active dur03 dly02">C</h2>
                                            <h2 className="visual_title ani_txt-fade-up active dur03 dly03">A</h2>
                                            <h2 className="visual_title ani_txt-fade-up active dur03 dly04">M</h2>
                                            <h2 className="visual_title ani_txt-fade-up active dur03 dly05">P</h2>
                                            <h2 className="visual_title ani_txt-fade-up active dur03 dly06">I</h2>
                                            <h2 className="visual_title ani_txt-fade-up active dur03 dly07">N</h2>
                                            <h2 className="visual_title ani_txt-fade-up active dur03 dly08">G</h2>
                                        </Link>
                                        <Link to="/review/list" className="hover_up01" style={{display: "flex"}}>
                                            <h2 className="visual_title ani_txt-fade-up active dur03 dly09">L</h2>
                                            <h2 className="visual_title ani_txt-fade-up active dur03 dly10">O</h2>
                                            <h2 className="visual_title ani_txt-fade-up active dur03 dly11">U</h2>
                                            <h2 className="visual_title ani_txt-fade-up active dur03 dly12">N</h2>
                                            <h2 className="visual_title ani_txt-fade-up active dur03 dly13">G</h2>
                                            <h2 className="visual_title ani_txt-fade-up active dur03 dly14">E</h2>
                                        </Link>
                                    </div>
                                    <div className="vid_wrap">
                                        <img className="ani_scale active dur15 dly02" src="/images/camp/sample_01.jpeg" alt=""/>
                                        <div className="icon-scroll">
                                            <img src="/images/common/icon_scroll.svg" alt="스크롤 해주세요"/>
                                            <p className="fs_md">Scroll</p>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </section>
                        <section className="sec">
                            <div className="inner_01">
                                <div className="title_wrap">
                                    <h2 className="main-subtitle">추천 캠핑장</h2>
                                    <Link to={"/camp"}>캠핑장 더 보기 👀</Link>
                                </div>
                                <Swiper
                                    ref={swiperRef}
                                    modules={[Navigation, Autoplay]}
                                    className={"swiper-container main-swiper01-container"}
                                    spaceBetween={32}
                                    slidesPerView={3}
                                    navigation={{nextEl: ".swiper01-next", prevEl: ".swiper01-prev"}}
                                    autoplay={{delay: 3000, disableOnInteraction: false}}
                                    speed={1000}
                                    loop={true} // 무한 루프
                                >
                                    {campList.map(function (camp, idx) {
                                        return <SwiperSlide><MainPageCampItem obj={camp} key={idx} cnt={idx + 1}/></SwiperSlide>
                                    })}
                                </Swiper>
                                <div className="swiper-arrow_wrap">
                                    <div className="swiper-arrow swiper01-prev"><img src="/images/common/arrow.svg"
                                                                                     alt=""/>
                                    </div>
                                    <div className="swiper-arrow swiper01-next"><img src="/images/common/arrow.svg"
                                                                                     alt=""/>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div className="pt_xlg"></div>
                        <section className="banner01 sec">
                            <div className="inner_01">
                                <div className="banner">
                                    <div className="txt-box">
                                        <h3 className="banner_title">캠핑라운지 오픈 이벤트!</h3>
                                        <p className="fs_xlg mb_sm tc-w">
                                            캠핑라운지 SNS를 팔로우하고 친구에게 공유하면 깜짝 선물이?!
                                        </p>
                                        <button className="btn btn-sm btn-s-f">이벤트 참여</button>
                                    </div>
                                    <img src="/images/main/event-banner.svg" alt=""/>
                                </div>
                            </div>
                        </section>
                        <section className="sec">
                            <div className="inner_01">
                                <div className="title_wrap">
                                    <h2 className="main-subtitle">베스트 리뷰</h2>
                                    <Link to={'/review/list'}>리뷰 모두 보기 👀</Link>
                                </div>
                                <Swiper
                                    ref={swiperRef}
                                    modules={[Navigation, Autoplay]}
                                    className={'swiper-container main-swiper02-container'}
                                    spaceBetween={32}
                                    slidesPerView={3}
                                    navigation={{
                                        nextEl: '.swiper02-next',
                                        prevEl: '.swiper02-prev',
                                    }}
                                    autoplay={{delay: 3000, disableOnInteraction: false}}
                                    speed={1000}
                                    loop={true}
                                >
                                    {bestReviews.map(function (review, idx) {
                                        return (
                                            <SwiperSlide>
                                                <MainPageReviewItem obj={review} key={idx} cnt={idx + 1}/>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>
                                <div className="swiper-arrow_wrap">
                                    <div className="swiper-arrow swiper02-prev">
                                        <img src="/images/common/arrow.svg" alt=""/>
                                    </div>
                                    <div className="swiper-arrow swiper02-next">
                                        <img src="/images/common/arrow.svg" alt=""/>
                                    </div>
                                </div>
                            </div>
                        </section>


                        <section className="banner02">
                            <p className="tc-w fs_lg txt-flow pt_sm pb_sm">
                                {lineBannerTxt} | {lineBannerTxt} | {lineBannerTxt}
                            </p>
                        </section>
                    </main>
                </div>
                <div className="container_s">
                    <div className="login_wrap">
                        <div className="login_inner">
                            <div className="login-box">
                                <div className="login-cir">
                                    {user.profile ?
                                        <img src={"http://localhost:8080/uploads/" + profilePath} alt="프로필 이미지" style={{
                                            width: "inherit",
                                            height: "inherit",
                                            display: "flex",
                                            borderRadius: "50%"
                                        }}/> : user.profile_url ? <img src={user.profile_url} alt="프로필 이미지" style={{
                                            width: "inherit",
                                            height: "inherit",
                                            display: "flex",
                                            borderRadius: "50%"
                                        }}/> : ""}
                                </div>
                                <p className="fs_lg txt-a-c mt_sm">
                                    {auth ? user.name : "Login"}
                                </p>
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
                                    {user.email ? <li><p className="fs_lg txt-a-c mt_sm">{user.email}</p></li> : ""}
                                    {user.tel ? <li><p className="fs_lg txt-a-c mt_sm">{user.tel}</p></li> : ""}
                                    {user.address ? <li><p className="fs_lg txt-a-c mt_sm">{user.address}</p></li> : ""}
                                    <button className="btn btn-s btn-lg mlr-a" onClick={() => {
                                        navigate(`/memberDetail/${user.id}`)
                                    }}>마이 페이지
                                    </button>
                                    <br/>
                                    <button className="btn btn-s btn-lg mlr-a" onClick={logout}>로그아웃</button>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}






export default MainPage;