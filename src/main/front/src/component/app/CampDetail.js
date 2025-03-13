import '../../css/camp-detail.css'
import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router";
import {Link, useNavigate} from "react-router-dom";
import {Fancybox} from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import axios from "axios";

import  Map from "./Map";
import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";
import CampDetailModal from "./CalenderModal";
import CampLikeBtn from "./CampLikeBtn";


function CampDetail(){
    const { headers, setHeaders } = useContext(HttpHeadersContext);
    const { auth, setAuth } = useContext(AuthContext);
    const [camp, setCamp] = useState({});
    const [thumb, setThumb] = useState({});
    const [images, setImages] = useState({});
    const {campId} = useParams();
    const navigation = useNavigate();
    const [x, setX] = useState();
    const [y, setY] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tabSwitch, setTabSwitch] = useState(false)

    const [reviewList, setReviewList] = useState(1);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCnt, setTotalCnt] = useState(0);

    const getCampDetail = async ()=>{
        try {
            const response = await axios.get(`http://localhost:8080/camp/${campId}`);

            console.log("[CampDetail.js] getCampDetail() success.");
            console.log(response.data);

            setCamp(response.data);
            setThumb(response.data.thumb);
            setImages(response.data.images);
            setX(response.data.campMapX);
            setY(response.data.campMapY);


        }catch (error){
            console.log("[CampDetail.js] getCampDetail() error.");
            console.log(error);
        }
    }

    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert("URL이 복사되었습니다!");
        } catch (err) {
            console.error("복사 실패:", err);
        }
    };

    useEffect(() => {
        if(tabSwitch){
            getReviewByCampId(campId,1);
        }
    }, [tabSwitch]);
    
    //탭 전환
    const handlerTab =()=>{
        setTabSwitch((prev) => !prev);
    }
    
    //리뷰 가져오기
    const getReviewByCampId = async (campId,page) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/camp/${campId}/review`,{params: {"page": page - 1}}
            );
            console.log("[CampDetail.js] getReviewByCampId() success.");
            console.log(response.data);
            setReviewList(response.data.content);
            setPageSize(response.data.pageSize);
            setTotalCnt(response.data.totalElements);

        } catch (error) {
            console.log("[CampDetail.js] getReviewByCampId() error.");
            console.error(error);
        }
    };

    // 페이징 보여주기
    const changePage = (page) => {
        getReviewByCampId(page);
    };


    useEffect(() => {
        setHeaders({
            "Authorization": `Bearer ${localStorage.getItem("CL_access_token")}`
        });
        getCampDetail();
    }, []);

    useEffect(() => {
        Fancybox.bind("[data-fancybox='gallery']", {}); // 특정 클래스 바인딩
        return () => {
            Fancybox.destroy(); // 언마운트 시 정리
        };
    }, []);
    return(
        <>
            <main id="main" className="camp-detail">
                <section className="sec">
                    <div
                        className="visual_wrap ani_visual"
                        style={{
                            backgroundImage: thumb?.[0]?.filePath ? `url(${thumb[0].filePath})` : "url('/images/camp/sample_01.jpeg')",
                        }}
                    >

                        <div className="inner_02">
                            <div className="txt-box">
                                <div className="title-box">
                                    <h3>{camp.campName}</h3>
                                     <CampLikeBtn campId={camp.id} />
                                    <div id="share-btn" className="icon" onClick={copyUrl}>
                                        <img src="/images/common/share.svg" alt=""/>
                                    </div>
                                </div>
                                <p className="fs_lg">📍 {camp.campAddressDo} {camp.campAddressGungu} {camp.campAddress1} {camp.campAddress2}</p>
                            </div>
                        </div>
                    </div>
                    <div className="inner_02 pt_lg">
                        <div className="btn-box">
                            <ul className="btn_list">
                                <li>
                                    <button className="btn btn-lg btn-p-f tap-btn tap01 active"
                                        onClick={(e)=> {
                                            e.preventDefault();
                                            handlerTab();
                                        }}>
                                        {!tabSwitch ? "캠핑장 후기" : "캠핑장 정보"}
                                    </button>
                                    <button className="btn btn-lg btn-p-f tap-btn tap02">
                                        캠핑장 정보
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-lg btn-s-f modal-btn" onClick={() => setIsModalOpen(true)}>
                                        예약하기
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-lg btn-p-f">
                                        {camp.campTel ? (
                                            <a href={`tel:${camp.campTel}`}>기타 문의 : {camp.campTel}</a>
                                        ) : (
                                            <a href={`tel:123-456-7890`}>기타 문의 : 고객센터 연결</a>
                                        )}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
                {!tabSwitch ? (
                    <>
                <article className="camp-info tap-menu active">
                    {!camp.toilet && !camp.electric && !camp.fireWood && !camp.hotWater && !camp.wifi && !camp.playGround && !camp.pet && !camp.swimming ? (
                        <div style={{paddingTop: 32}}></div>
                    ) :(
                        <section className="sec">
                            <div className="inner_02">
                                <h3 className="title">시설 정보</h3>
                                <div className="icon-info mb_md">
                                    <ul className="icon_list">
                                        {camp.electric ? (
                                            <li>
                                                <img src="/images/camp/icon_electric.svg" alt=""/>
                                                <p className="fs_md txt-a-c">전기</p>
                                            </li>
                                        ) : null}
                                        {camp.toilet ? (
                                            <li>
                                                <img src="/images/camp/icon_toilet.svg" alt=""/>
                                                <p className="fs_md txt-a-c">화장실</p>
                                            </li>
                                        ) : null}

                                        {camp.fireWood ? (
                                            <li>
                                                <img src="/images/camp/icon_fire.svg" alt=""/>
                                                <p className="fs_md txt-a-c">장작 판매</p>
                                            </li>
                                        ) : null}
                                        {camp.hotWater ? (
                                            <li>
                                                <img src="/images/camp/icon_hotwater.svg" alt=""/>
                                                <p className="fs_md txt-a-c">온수</p>
                                            </li>
                                        ) : null}
                                        {camp.wifi ? (
                                            <li>
                                                <img src="/images/camp/icon_wifi.svg" alt=""/>
                                                <p className="fs_md txt-a-c">와이파이</p>
                                            </li>
                                        ) : null}
                                        {camp.playGround ? (
                                            <li>
                                                <img src="/images/camp/icon_play.svg" alt=""/>
                                                <p className="fs_md txt-a-c">운동시설</p>
                                            </li>
                                        ) : null}
                                        {camp.pet ? (
                                            <li>
                                                <img src="/images/camp/icon_pet.svg" alt=""/>
                                                <p className="fs_md txt-a-c">반려동물</p>
                                            </li>
                                        ) : null}
                                        {camp.swimming ? (
                                            <li>
                                                <img src="/images/camp/icon_swim.svg" alt=""/>
                                                <p className="fs_md txt-a-c">물놀이</p>
                                            </li>
                                        ) : null}
                                    </ul>
                                </div>
                            </div>
                        </section>

                    )}
                    <section className="sec">
                        <div className="inner_02">
                            <h3 className="title">캠핑장 소개</h3>
                            <div className="bar mt_md"></div>
                            <p className="fs_md mt_md">
                                {camp.campInfo}
                            </p>
                        </div>
                    </section>
                    {!!x && !!y ? (
                        <section className="sec">
                            <div className="inner_02">
                                <h3 className="title">캠핑장 위치</h3>
                                <div className="bar mt_md mb_lg"></div>
                                <div className="map_wrap">
                                    <Map x={x} y={y} campName={camp.campName}/>
                                </div>

                            </div>
                        </section>
                    ) : null}
                    {images.length > 0 ? (
                        <section className="sec">
                            <div className="inner_02">

                                <h3 className="title">갤러리</h3>
                                <div className="bar mt_md mb_lg"></div>
                                <div>
                                    <ul className="gallery mb_md">
                                        {images.map((image,index)=> (
                                            <li key={index}><a href={`${image.filePath}`} data-fancybox="gallery"><img
                                                src={image.filePath} alt={`image-${index}`}/></a></li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>
                    ) : null}
                </article>
                    </>
                ):(
                    <>
                        <article className="camp-info tap-menu active">
                            <section className="sec">
                                <div className="inner_02">
                                    <h3 className="title">캠핑장 후기</h3>
                                    <div className="bar mt_md mb_lg"></div>
                                    <ul className="review_list">
                                        {reviewList.length > 0 ? (
                                            <>
                                            {reviewList.map(function (review, idx) {
                                                    return <ReviewItem obj={review} key={idx} cnt={idx + 1}/>
                                                })}
                                            </>
                                        ): (
                                            <p className="txt-a-c fs_xlg">
                                                작성된 리뷰가 없습니다
                                            </p>
                                        )}
                                    </ul>
                                </div>
                            </section>
                        </article>
                    </>
                    
                    )}
                    <section className="sec">
                        <div className="inner_02">
                            <div className="bar mb_lg"></div>
                            <button className="btn btn-s btn-lg modal-btn mlr-a"
                                    onClick={() => setIsModalOpen(true)}>예약하기
                            </button>
                        </div>
                    </section>
                    <CampDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
                                     campId={campId} campName={camp.campName}/>
                </main>
                </>

                );
            }

function ReviewItem(props) {
    const review = props.obj;
    const url = window.location.href + "/" + review.reviewId;
    const copyUrl = async (e) => {
        e.preventDefault();
        try {
            await navigator.clipboard.writeText(url);
            alert("URL이 복사되었습니다!");
        } catch (err) {
            console.error("복사 실패:", err);
        }
    };
    return (
        <li className="review">
            <div className="wrap">
                <Link to={{pathname: `/review/${review.reviewId}`}}>
                    <div className="img-area">
                        <img
                            src={
                                review.reviewImages &&
                                review.reviewImages.length > 0
                                    ? review.reviewImages[0].filePath
                                    : '/images/review/noimage.png'
                            }
                            alt="썸네일"
                        />
                        <div className="btn-box">
                            <CampLikeBtn campId={review.id}/>
                            <div id="share-btn" className="icon" onClick={copyUrl}>
                                <img src="/images/common/share.svg" alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className="txt-area">
                        <h3 className="fs_lg mb_xsm">
                            {review.reviewTitle}
                        </h3>
                        <p className="fs_md">
                            {review.createdDate}
                        </p>
                    </div>
                </Link>
            </div>
        </li>
    );
}

export default CampDetail;