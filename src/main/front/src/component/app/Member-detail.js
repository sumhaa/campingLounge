import '../../css/swiper.min.css';
import '../../css/member-detail.css';
import MemberArea from "../MemberDetail/MemberArea";
import ActivitiesArea from "../MemberDetail/ActivitiesArea";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import {useState} from "react";

function MemberDetail() {

    const [user,setUser] = useState("");

    return (
        <>
            <main id="main" className="member-detail">
                <div className="container">
                    <div className="inner_01">
                        <MemberArea user={user} setUser={setUser}/>
                        <ActivitiesArea user={user}/>
                    </div>
                </div>
            </main>
        </>
    );
}

export default MemberDetail;