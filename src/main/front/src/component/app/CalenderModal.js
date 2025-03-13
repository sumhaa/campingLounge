import React from "react";
import Calendar from "./Calender";

function Modal({ isOpen, onClose , campId, campName}) {

    return (
        <>
            <div id="dark-area" className={`${isOpen ? "active" : ""}`} onClick={onClose}></div>
            <article id="modal" className={`${isOpen ? "active" : ""}`}>
                <div className="wrap">
                    <div className="close-btn" onClick={onClose}>
                        <img src="/images/common/icon_close.svg" alt="닫기" />
                    </div>
                    <div className="modal_inner">
                        <Calendar campId={campId} campName={campName}/>
                    </div>
                </div>
            </article>
        </>
    );
}

export default Modal;
