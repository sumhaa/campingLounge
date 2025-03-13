import React, { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {loadTossPayments} from "@tosspayments/payment-sdk";

function Calendar({campId, campName}) {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeDay, setActiveDay] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const navigate = useNavigate();
    const [memberId, setMemberId] = useState(localStorage.getItem("id"));
    const [memberEmail, setMemberEmail] = useState(localStorage.getItem("email"));
    const clientKey = process.env.REACT_APP_TOSS_API_KEY;
    console.log(clientKey);

    const newReservation = async (e) =>{
        e.preventDefault();
        const req = {
            memberId:parseInt(memberId) ,
            campId:parseInt(campId) ,
            memberEmail: memberEmail,
            campName: campName,
            reservationDate: new Date().toISOString(),
            usageDate: selectedDate
        };
        console.log(req);
        try{
            const response = await axios.post(`http://localhost:8080/camp/${campId}/reservation`, req)
            if(response.status === 200 || response.status === 201){
                handlePayment();
            } else {
                alert("예약이 실패하였습니다." + response.data.message);
            }
        } catch (error){
            console.error("[Error Details]", error);
            alert("서버와의 연결 오류: " + (error.response?.data?.message));
        }
    }
    const handlePayment = () => {
        const random = new Date().getTime() + Math.random();
        const randomId = btoa(random);

        loadTossPayments(clientKey).then(tossPayments => {
            tossPayments.requestPayment("카드", {
                amount: 50000,
                orderId: `${randomId}`,
                orderName: "캠핑라운지",
                customerName: '테스트',
                successUrl: window.location.origin + "/success",
                failUrl: window.location.origin + "/fail"
            }).then(() => {
                // 결제 성공 시 예약 요청
                newReservation();
            }).catch(error => {
                alert("결제가 취소되었습니다.");
                console.error("결제 실패", error);
            });
        });
    };

    useEffect(() => {
        renderCalendar();
    }, [currentDate]);

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const prevLastDate = new Date(year, month, 0).getDate();

        const daysArray = [];

        // 지난달 날짜 추가 (비활성)
        for (let i = firstDay - 1; i >= 0; i--) {
            daysArray.push({
                year,
                month: month - 1,
                day: prevLastDate - i,
                inactive: true,
            });
        }

        // 이번 달 날짜 추가
        for (let i = 1; i <= lastDate; i++) {
            const isToday = year === today.getFullYear() && month === today.getMonth() && i === today.getDate();
            const isPastDate =
                year < today.getFullYear() ||
                (year === today.getFullYear() && month < today.getMonth()) ||
                (year === today.getFullYear() && month === today.getMonth() && i < today.getDate());

            daysArray.push({
                year,
                month,
                day: i,
                today: isToday,
                inactive: isPastDate, // 오늘 이전 날짜는 비활성
            });
        }

        return daysArray;
    }

    function handlePrevMonth(e) {
        e.preventDefault();
        if (currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth()) return;
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        //setActiveDay(null);
    }

    function handleNextMonth(e) {
        e.preventDefault();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        //setActiveDay(null);
    }

    function handleSelectDay(dayObj) {
        if (dayObj.inactive) return;

        setActiveDay(dayObj);
        setSelectedDate(
            `${dayObj.year}-${String(dayObj.month + 1).padStart(2, "0")}-${String(dayObj.day).padStart(2, "0")}`
        );
    }

    return (
        <form id="reservation-form" onSubmit={newReservation}>
            <input type="text" value={selectedDate} readOnly id="selectedDate" placeholder="예약 날짜 선택"/>
            <div className="calendar">
                <div className="calendar-header">
                    <button className="cal-prev" onClick={handlePrevMonth}>
                        <img src="/images/common/arrow-prev.svg" alt="이전 달"/>
                    </button>
                    <h4 id="monthYear" className="cal-month">
                        {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                    </h4>
                    <button className="cal-next" onClick={handleNextMonth}>
                        <img src="/images/common/arrow-next.svg" alt="다음 달"/>
                    </button>
                </div>
                <div className="weekdays">
                    {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                        <div key={day}>{day}</div>
                    ))}
                </div>
                <div className="days">
                    {renderCalendar().map((date, index) => {
                        const isActive =
                            activeDay &&
                            activeDay.year === date.year &&
                            activeDay.month === date.month &&
                            activeDay.day === date.day;

                        return (
                            <div
                                key={index}
                                className={`day ${date.today ? "today" : ""} ${date.inactive ? "inactive" : ""} ${isActive ? "active" : ""}`}
                                onClick={() => handleSelectDay(date)}
                            >
                                <p>{date.day}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
            <input type="submit" className="submit input-lg" value="예약하기"/>

        </form>
    );
}

export default Calendar;


