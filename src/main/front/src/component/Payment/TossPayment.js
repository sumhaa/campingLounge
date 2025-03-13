import React from "react";
import {loadTossPayments} from "@tosspayments/payment-sdk";

const TossPayment = () => {
    const clientKey = "test_ck_LlDJaYngroXZlGRJ1oWl8ezGdRpX"; // Toss Payments 테스트용 클라이언트 키



    const handlePayment = () => {
        const random = new Date().getTime() + Math.random(); //난수생성
        const randomId = btoa(random); //난수를 btoa(base64)로 인코딩한 orderID

        if (true) { //간편결제 함수 실행
            loadTossPayments(clientKey).then(tossPayments => {
                tossPayments.requestPayment("카드", {
                    amount: 50000, //주문가격
                    orderId: `${randomId}`, //문자열 처리를 위한 ``사용
                    orderName: "캠핑라운지", //결제 이름(여러건일 경우 복수처리)
                    customerName: '테스트', //판매자, 판매처 이름
                    successUrl: "http://localhost:3000/success",
                    failUrl: "http://localhost:3000/fail",
                })
            });
        }
    }
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>✅ Toss Payments 결제 테스트</h2>
            <button onClick={handlePayment} style={{ padding: "10px 20px", fontSize: "16px" }}>
                결제하기
            </button>
        </div>
    );
};

export default TossPayment;
