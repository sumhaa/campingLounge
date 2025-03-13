import "../../css/layout.css";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import FooterModal from "./FooterModal";

function Footer({mainPage, mainLayoutChange}) {
    const [footerChange, setFooterChange] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState("PrivacyPolicy");


    useEffect(() => {
        setFooterChange(false)
    }, [mainPage]);

    useEffect(() => {
        if(mainPage){
            setFooterChange(prev => !prev);
        }
    }, [mainLayoutChange]);

    return (
        <>
        <footer id="footer"  className={footerChange ? "footer mainLoginOpen" : "footer"}>
            <div className="inner_02">
                <div className="footer-top">
                    <div className="logo">
                        <Link to={'/'}>캠핑라운지</Link>
                    </div>
                    <ul className="policy-list">
                        <li className="fs_md" onClick={()=>{
                            setModalContent("PrivacyPolicy");
                            setIsOpen(true);
                        }}>
                            개인정보처리방침
                        </li>
                        <li className="fs_md" onClick={() => {
                            setModalContent("PrivacyPolicy");
                            setIsOpen(true);
                        }}>
                            법적고지
                        </li>
                        <li className="fs_md" onClick={() => {
                            setModalContent("PrivacyPolicy");
                            setIsOpen(true);
                        }}>
                            이용약관
                        </li>
                        <li className="fs_md">
                            <Link to={"/admin"}>관리자페이지</Link>
                        </li>
                    </ul>
                    <ul className="sns_list">
                        <li>
                            <img src="/images/common/icon_facebook.svg" alt=""/>
                        </li>
                        <li>
                            <img src="/images/common/icon_instagram.svg" alt=""/>
                        </li>
                        <li>
                            <img src="/images/common/icon_twitter.svg" alt=""/>
                        </li>
                        <li>
                            <img src="/images/common/icon_youtube.svg" alt=""/>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="bar bar-n60 mt_md mb_lg"></div>
            <div className="inner_02">
                <div className="footer_info">
                    <p className="fs_md">
                        서울 구로구 시흥대로163길 33 주호타워 2층,3층
                    </p>
                    <p className="fs_md">
                        TEL : 123-456-7890 (상담시간 : 평일 10:00~18:00)
                    </p>
                    <p className="fs_md">
                        EMAIL : campinglounge@email.com
                    </p>
                    <p className="fs_md mt_sm">
                        <b>Copyrights(c) 2025 CAMPINGLOUNGE ALL RIGHTS RESERVED.</b>
                    </p>
                </div>
            </div>
        </footer>
        <FooterModal isOpen={isOpen} onClose={() => setIsOpen(false)} content={modalContent}/>
        </>
    );
}

export default Footer;