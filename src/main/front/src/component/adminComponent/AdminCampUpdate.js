import {useEffect, useState, useContext } from "react";
import axios from "axios";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

function AdminCampUpdate({isOpen, onClose, campId }){
    const [camp,setCamp] = useState([]);
    const [campName, setCampName] = useState("");
    const [campInfo, setCampInfo] = useState("");
    const [campTel, setCampTel] = useState("");
    const [campAddressDo, setCampAddressDo] = useState("");
    const [campAddressGungu, setCampAddressGungu] = useState("");
    const [campAddress1, setCampAddress1] = useState("");
    const [campAddress2, setCampAddress2] = useState("");
    const [campMapX, setCampMapX] = useState("");
    const [campMapY, setCampMapY] = useState("");
    const [toilet, setToilet] = useState(false);
    const [hotWater, setHotWater] = useState(false);
    const [electric, setElectric] = useState(false);
    const [fireWood, setFireWood] = useState(false);
    const [wifi, setWifi] = useState(false);
    const [playGround, setPlayGround] = useState(false);
    const [pet, setPet] = useState(false);
    const [swimming, setSwimming] = useState(false);
    const [totalCapacity, setTotalCapacity] = useState(0);

    const [campTel1,setCampTel1] = useState("");
    const [campTel2,setCampTel2] = useState("");
    const [campTel3,setCampTel3] = useState("");
    const [toiletCheck, setToiletCheck] = useState(false);

    const token = localStorage.getItem("CL_access_token");
    const { headers, setHeaders } = useContext(HttpHeadersContext);

    const campTellSum = ()=>{
        setCampTel(`${campTel1} - ${campTel2} - ${campTel3}`);
    }
    const toiletCount = ()=>{
        setToilet(toiletCheck ? 1 : 0);
    }
    useEffect(() => {
        if (campId){
            getCamp(campId);
        }
    }, [campId]);

    useEffect(() => {
        setHeaders({ "Authorization": `Bearer ${token}` });
    }, []);

    useEffect(() => {
        if (camp) {
            setCampName(camp.campName || "");
            setCampInfo(camp.campInfo || "");
            setCampTel(camp.campTel || "");
            setCampAddressDo(camp.campAddressDo || "");
            setCampAddressGungu(camp.campAddressGungu || "");
            setCampAddress1(camp.campAddress1 || "");
            setCampAddress2(camp.campAddress2 || "");
            setCampMapX(camp.campMapX || "");
            setCampMapY(camp.campMapY || "");
            setToilet(camp.toilet || false);
            setHotWater(camp.hotWater || false);
            setElectric(camp.electric || false);
            setFireWood(camp.fireWood || false);
            setWifi(camp.wifi || false);
            setPlayGround(camp.playGround || false);
            setPet(camp.pet || false);
            setSwimming(camp.swimming || false);
            setTotalCapacity(camp.totalCapacity || 0);
        }
        if (camp.campTel) {
            console.log("test3")
            const parts = camp.campTel.split("-");
            setCampTel1(parts[0] || "");
            setCampTel2(parts[1] || "");
            setCampTel3(parts[2] || "");
        }
    }, [camp]);

    const campWrite = async (e) => {
        e.preventDefault();

        const req = {
            campName : campName,
            campInfo : campInfo,
            campTel : campTel,
            campAddressDo : campAddressDo,
            campAddressGungu :campAddressGungu,
            campAddress1 : campAddress1,
            campAddress2 : campAddress2,
            campMapX : campMapX,
            campMapY : campMapY,
            toilet : toilet,
            hotWater : hotWater,
            electric : electric,
            fireWood : fireWood,
            wifi : wifi,
            playGround : playGround,
            pet : pet,
            swimming : swimming,
            totalCapacity :totalCapacity,
        };

        await axios
            .patch(`http://localhost:8080/admin/camp/${camp.id}/update`, req, { headers } )
            .then((resp) => {
                console.log("[AdminCampUpdate.js] CampUpdate() success.");
                console.log(resp.data);
                alert("게시물 수정 성공.");
                onClose();
            })
            .catch((err) => {
                console.log("[AdminCampUpdate.js] CampUpdate() error.");
                console.log(err);
                alert("게시물 수정 실패");
            });
    };

    const getCamp = async (campId)=>{
        await axios
            .get(`http://localhost:8080/admin/camp/${campId}`, { headers })
            .then((resp)=>{
                console.log("[AdminCampUpdate.js] getCamp() success.");
                console.log(resp.data);
                setCamp(resp.data);
            })
            .catch((err) => {
                console.log("[AdminCampUpdate.js] getCamp() error.");
                console.log(err);
            });
    }

    return(
        <>
            <div id="dark-area" className={`${isOpen ? "active" : ""}`} onClick={onClose}></div>
            <article id="modal" className={`${isOpen ? "active" : ""}`}>
                <div className="close-btn" onClick={onClose}>
                    <img src="/images/common/icon_close.svg" alt="닫기"/>
                </div>
                <div className="modal_inner camp-write">
                    <h3 className="fs_xlg">캠핑장 등록</h3>
                    <form onSubmit={campWrite}>
                        <input type="hidden" value={camp.id}/>
                        <table>
                            <colgroup>
                                <col width={20 + "%"}/>
                                <col width={80 + "%"}/>
                            </colgroup>
                            <tbody>
                            <tr>
                                <td>
                                    <label className="label fs_md" htmlFor="campName">캠핑장 이름</label>
                                </td>
                                <td>
                                    <input className="max" type="text" id="campName" name="campName" value={campName}
                                           onChange={(e) => {
                                               setCampName(e.target.value);
                                           }} required/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className="label fs_md" htmlFor="campInfo">캠핑장 설명</label>
                                </td>
                                <td>
                                    <textarea rows={10} id="campInfo" name="campInfo" value={campInfo}
                                              onChange={(e) => {
                                                  setCampInfo(e.target.value);
                                              }} required/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className="label fs_md">연락처</label>
                                </td>
                                <td style={{display: "flex", gap: "1rem"}}>
                                    <select value={campTel1} onChange={(e) => {
                                        setCampTel1(e.target.value);
                                        campTellSum();
                                    }}>
                                        <option>010</option>
                                        <option>011</option>
                                        <option>016</option>
                                        <option>019</option>
                                    </select> -
                                    <input className="max" type="number" value={campTel2}
                                           onChange={(e) => {
                                               setCampTel2(e.target.value);
                                               campTellSum();
                                           }}/> -
                                    <input className="max" type="number" value={campTel3}
                                           onChange={(e) => {
                                               setCampTel3(e.target.value);
                                               campTellSum();
                                           }}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className="label fs_md">주소</label>
                                </td>
                                <td>
                                    <div className="item-box mb_sm" style={{gap: "1rem"}}>
                                        <input className="max" name="campAddressDo" type="text" placeholder="도"
                                               value={campAddressDo} onChange={(e) => {
                                            setCampAddressDo(e.target.value);
                                        }}/>
                                        <input className="max" type="text" name="campAddressGungu" placeholder="시/군/구"
                                               value={campAddressGungu} onChange={(e) => {
                                            setCampAddressGungu(e.target.value);
                                        }}/>
                                    </div>
                                    <input className="max mb_sm" name="campAddress1" type="text" placeholder="상세 주소 1"
                                           value={campAddress1} onChange={(e) => {
                                        setCampAddress1(e.target.value);
                                    }}/>
                                    <input className="max" type="text" name="campAddress2" placeholder="상세 주소 2"
                                           value={campAddress2} onChange={(e) => {
                                        setCampAddress2(e.target.value);
                                    }}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className="label fs_md">기타</label>
                                </td>
                                <td>
                                    <div className="item-box" style={{justifyContent: "space-between"}}>
                                        <input type="text" name="campMapX" placeholder="x 좌표" value={campMapX}
                                               onChange={(e) => {
                                                   setCampMapX(e.target.value);
                                               }}/> :
                                        <input type="text" name="campMapY" placeholder="y 좌표" value={campMapY}
                                               onChange={(e) => {
                                                   setCampMapY(e.target.value);
                                               }}/> <p className="tc-p">|</p>
                                        <input type="text" name="totalCapacity" placeholder="최대 수용 인원"
                                               value={totalCapacity} onChange={(e) => {
                                            setTotalCapacity(Number(e.target.value));
                                        }}/>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className="label fs_md">시설 정보</label>
                                </td>
                                <td>
                                    <ul className="icon_list">
                                        <li>
                                            <input id="electric" name="electric" type="checkbox" checked={electric}
                                                   onChange={(e) => {
                                                       setElectric(e.target.checked);
                                                   }}/>
                                            <label htmlFor="electric">전기</label>
                                        </li>
                                        <li>
                                            <input id="toilet" name="toilet" type="checkbox" checked={toilet}
                                                   onChange={(e) => {
                                                       setToiletCheck(e.target.checked);
                                                       toiletCount();
                                                   }}/>
                                            <label htmlFor="toilet">화장실</label>
                                        </li>
                                        <li>
                                            <input id="hotWater" name="hotWater" type="checkbox" checked={hotWater}
                                                   onChange={(e) => {
                                                       setHotWater(e.target.checked);
                                                   }}/>
                                            <label htmlFor="hotWater">온수</label>
                                        </li>
                                        <li>
                                            <input id="fireWood" name="fireWood" type="checkbox" checked={fireWood}
                                                   onChange={(e) => {
                                                       setFireWood(e.target.checked);
                                                   }}/>
                                            <label htmlFor="fireWood">장작 판매</label>
                                        </li>
                                        <li>
                                            <input id="wifi" name="wifi" type="checkbox" checked={wifi}
                                                   onChange={(e) => {
                                                       setWifi(e.target.checked);
                                                   }}/>
                                            <label htmlFor="wifi">와이파이</label>
                                        </li>
                                        <li>
                                            <input id="playGround" name="playGround" type="checkbox"
                                                   checked={playGround} onChange={(e) => {
                                                setPlayGround(e.target.checked);
                                            }}/>
                                            <label htmlFor="playGround">운동 시설</label>
                                        </li>
                                        <li>
                                            <input id="pet" name="pet" type="checkbox" checked={pet} onChange={(e) => {
                                                setPet(e.target.checked);
                                            }}/>
                                            <label htmlFor="pet">동물 출입</label>
                                        </li>
                                        <li>
                                            <input id="swimming" name="swimming" type="checkbox" checked={swimming}
                                                   onChange={(e) => {
                                                       setSwimming(e.target.checked);
                                                   }}/>
                                            <label htmlFor="swimming">물놀이</label>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <button type="submit" className="btn btn-lg btn-s-f mt_md mlr-a"
                                style={{borderRadius: "15px"}}>등록
                        </button>
                    </form>
                    <div className="bar mt_lg"></div>
                </div>
            </article>
        </>
    );
}

export default AdminCampUpdate;