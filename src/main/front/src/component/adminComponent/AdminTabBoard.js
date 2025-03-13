import {useState,useEffect} from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import AdminReservationCount from "./AdminReservationCount";
import {Link} from "react-router-dom";
import AdminReservationBoard from "./AdminReservationBoard";
import AdminReviewCount from "./AdminReviewCount";
import AdminCommentCount from "./AdminCommentCount";
import AdminReviewBoard from "./AdminReviewBoard";
import AdminCommentBoard from "./AdminCommentBoard";
function AdminTabBoard({selected}){
    const [selectedTap,setSelectedTap] = useState(selected)

    useEffect(()=>{
        setSelectedTap(selected)
    },[selected])
    return(
        <>
            <section id="memberboard" className="component">
                <div className="inner_02">
                    <div className="item">
                        <h3 className="fs_xlg">
                            {selectedTap==="resBoard" ? (
                               <>예약 관리</>
                            ) : selectedTap==="reviewBoard" ? (
                                <>리뷰 관리</>
                            ) : selectedTap==="commentBoard" ? (
                                <>댓글 관리</>
                            ) : (
                                <>로딩 중</>
                            )}
                        </h3>
                        <ul className="dashboard_list mb_lg">
                            <li onClick={()=>setSelectedTap("resBoard")} style={{cursor:"pointer"}}>
                                <AdminReservationCount />
                            </li>
                            <li onClick={()=>setSelectedTap("reviewBoard")} style={{cursor:"pointer"}}>
                                <AdminReviewCount />
                            </li>
                            <li onClick={()=>setSelectedTap("commentBoard")} style={{cursor:"pointer"}}>
                                <AdminCommentCount />
                            </li>
                        </ul>
                        {selectedTap==="resBoard" ? (
                            <AdminReservationBoard />
                        ): selectedTap==="reviewBoard" ? (
                            <AdminReviewBoard />
                        ) : selectedTap==="commentBoard" ? (
                            <AdminCommentBoard />
                        ) : (
                            <AdminReservationBoard />
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
export default AdminTabBoard;