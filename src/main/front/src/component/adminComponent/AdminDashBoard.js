import AdminNewMember from "./AdminNewMember";
import axios from "axios";
import {useEffect, useState} from "react";
import AdminMemberCount from "./AdminMemberCount";
import AdminCampCount from "./AdminCampCount";
import AdminReservationCount from "./AdminReservationCount";
import AdminReviewCount from "./AdminReviewCount";
import AdminCommentCount from "./AdminCommentCount";
import AdminChattingCount from "./AdminChattingCount";

function AdminDashBoard({loginUserId}){
    return (
        <section id="dashboard" className="component">
            <div className="inner_02">
                <div className="item">
                    <h3 className="fs_xlg">전체 현황</h3>
                    <ul className="dashboard_list mb_md">
                        <li>
                            <AdminMemberCount/>
                        </li>
                        <li>
                            <AdminCampCount/>
                        </li>
                        <li>
                            <AdminReservationCount/>
                        </li>
                    </ul>
                    <ul className="dashboard_list">
                        <li>
                           <AdminReviewCount />
                        </li>
                        <li>
                            <AdminCommentCount />
                        </li>
                        <li>
                            <AdminChattingCount />
                        </li>
                    </ul>
                </div>
                <div className="item">
                    <AdminNewMember loginUserId={loginUserId}/>
                </div>
            </div>
        </section>
    );
}

export default AdminDashBoard;