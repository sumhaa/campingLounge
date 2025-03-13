import {useEffect, useState, useContext } from "react";
import axios from "axios";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

function AdminMemberGenderRatio() {
    const [maleCount, setMaleCount] = useState(0);
    const [femaleCount, setFemaleCount] = useState(0);
    const token = localStorage.getItem("CL_access_token");
    const { headers, setHeaders } = useContext(HttpHeadersContext);

    useEffect(() => {
        getGenderRatio();
        setHeaders({ "Authorization": `Bearer ${token}` });
    }, []);

    const getGenderRatio = async () => {
        try {
            const response = await axios.get("http://localhost:8080/admin/member/gender", { headers });
            console.log("[AdminGenderRatio.js] getGenderRatio() success.");
            console.log(response.data);
            setMaleCount(response.data.male);
            setFemaleCount(response.data.female);
        } catch (error) {
            console.log("[AdminGenderRatio.js] getGenderRatio() error.");
            console.log(error);
        }
    };
    const mc = Number(maleCount);
    const fc = Number(femaleCount);
    const sum = mc + fc
    const mcPer =parseInt((mc / sum) *100) ;
    const fcPer = parseInt( (fc / sum) *100);


    return (
        <>
            <div className="icon"><img src="/images/camp/icon_toilet.svg" /></div>
            <p className="fs_lg mt_md mb_md">남여 성비</p>
            <p className="fs_xlg"> {mcPer} : {fcPer} </p>

        </>
    );
}

export default AdminMemberGenderRatio;
