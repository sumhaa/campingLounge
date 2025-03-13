import ReviewArea from "./ReviewArea";
import CommentArea from "./CommentArea";
import ReservationArea from "./ReservationArea";
import {useState} from "react";

function ActivitiesArea({user}) {

    const [activeTab, setActiveTab] = useState(0);

    return (
        <article className="activities-area">
            <div className="wrap">
                <ul className="act_list">
                    <li className={`act-tap ${activeTab === 0 ? "active" : ""}`}>
                        <section className="act">
                            <div className="tap-btn" onClick={() => setActiveTab(0)}>
                                <ul className="bar-wrap">
                                    <li className="bar"></li>
                                    <li className="bar"></li>
                                </ul>
                            </div>
                            {activeTab === 0 && <ReviewArea />}
                            <div className="title-area">
                                <p className="title">
                                    Review
                                </p>
                            </div>
                        </section>
                    </li>
                    {user.id == localStorage.getItem("id") ? <><li className={`act-tap ${activeTab === 1 ? "active" : ""}`}>
                        <section className="act">
                            <div className="tap-btn" onClick={() => setActiveTab(1)}>
                                <ul className="bar-wrap">
                                    <li className="bar"></li>
                                    <li className="bar"></li>
                                </ul>
                            </div>
                            {activeTab === 1 && <CommentArea/>}
                            <div className="title-area">
                                <p className="title">
                                    Comment
                                </p>
                            </div>
                        </section>
                    </li>
                        <li className={`act-tap ${activeTab === 2 ? "active" : ""}`}>
                            <section className="act">
                                <div className="tap-btn" onClick={() => setActiveTab(2)}>
                                    <ul className="bar-wrap">
                                        <li className="bar"></li>
                                        <li className="bar"></li>
                                    </ul>
                                </div>
                                {activeTab === 2 && <ReservationArea/>}
                                <div className="title-area">
                                    <p className="title">
                                        Reservation
                                    </p>
                                </div>
                            </section>
                        </li></> : ""}
                </ul>
            </div>
        </article>
    );
}

export default ActivitiesArea;