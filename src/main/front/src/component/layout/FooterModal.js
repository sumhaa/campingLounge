import React from "react";
import PrivacyPolicy from "../context/PrivacyPolicy";

function FooterModal({isOpen,onClose,content}){
    return (
        <>
            <div id="ft-dark-area" className={`${isOpen ? "active" : ""}`} onClick={onClose}></div>
            <article id="ft-modal" className={`${isOpen ? "active" : ""}`}>
                <div className="close-btn" onClick={onClose}>
                    <img src="/images/common/icon_close.svg" alt="닫기" />
                </div>
                <div className="modal_inner">
                    {content ==="PrivacyPolicy" ? (
                       <PrivacyPolicy />
                    ): null}
                </div>
            </article>
        </>
    );
}
export default FooterModal;