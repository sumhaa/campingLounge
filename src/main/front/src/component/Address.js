import { useEffect, useState } from "react";

function Address({setAddress, setPostcode}) {

    useEffect(() => {
        if (!window.daum) {
            const script = document.createElement("script");
            script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const openPostcode = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {

                setAddress(data.address);
                setPostcode(data.zonecode);
            }
        }).open();
    };

    return (
        <div>
            <button type="button" className="btn btn-p-f btn-sm" onClick={openPostcode}>주소 찾기</button>
        </div>
    );
}

export default Address;
