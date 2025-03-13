import {useEffect, useState, useContext} from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

function AdminReservationBoard(){

    const [res, setRes] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCnt, setTotalCnt] = useState(0);
    const [ sort,setSort ] = useState("id");
    const [ direction,setDirection ] = useState(",desc");

    const [selectAll, setSelectAll] = useState(false);
    const [selectedRes, setSelectedRes] = useState([]);

    const token = localStorage.getItem("CL_access_token");
    const { headers, setHeaders } = useContext(HttpHeadersContext);

    const changeSort= (param)=>{
        setSort(param)
    }
    const changeDirection= (param)=>{
        setDirection(param)
    }

    useEffect(() => {
        setHeaders({ "Authorization": `Bearer ${token}` });
    }, []);

    useEffect(() => {
        getReservations(page,sort || "id");
    }, [sort,direction]);

    // Paging
    const getReservations = async (page, sort) => {
        await axios.get("http://localhost:8080/admin/reservation", {params:{ "page": page -1, "sort" : sort + direction, "size" : 15 }, headers})
            .then(response => {
                setRes(response.data.content);
                setSelectedRes([]);
                setPageSize(response.data.pageSize);
                setTotalCnt(response.data.totalElements);
                console.log("[AdminReservationBoard] getReservations() success :")
                console.log(response.data.content)
            })
            .catch(error => {
                console.log("[AdminReservationBoard] getReservations() error :")
                console.error("예약내역 조회 실패 : ", error);
            })
    }

    const deleteRes = async (e,resId) => {
        e.preventDefault()
        if (window.confirm("예약을 삭제하시겠습니까?")) {
            await axios.delete(`http://localhost:8080/admin/reservation/${resId}/delete`, {headers})
                .then(response => {
                    console.log(response.data);
                    getReservations(page, sort);
                })
                .catch(error => {
                    console.error("예약 삭제 중 오류 발생 : ", error);
                })
        }
    }


    const handleSelectRes = (resId) => {
        setSelectedRes(prevSelected =>
            prevSelected.includes(resId)
                ? prevSelected.filter(id => id !== resId)
                : [...prevSelected, resId]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRes([]);
        } else {
            setSelectedRes(res.map((item) => item.id));
        }
        setSelectAll(!selectAll);
    };

    const handleBulkDelete = async (e) => {
        e.preventDefault();
        if (selectedRes.length === 0) {
            alert("삭제할 예약을 선택해주세요.");
            return;
        }
        if (window.confirm("선택한 예약을 삭제하시겠습니까?")) {
            await Promise.all(selectedRes.map(resId => axios.delete(`http://localhost:8080/admin/reservation/${resId}/delete`, {headers})))
                .then(() => {
                    alert("선택한 예약이 삭제되었습니다.");
                    getReservations(sort,direction);
                })
                .catch(error => {
                    console.error("일괄 삭제 중 오류 발생 : ", error);
                });
        }
    };

    // 페이징 보여주기
    const changePage = (page) => {
        setPage(page);
        getReservations(page ,sort);
    };

    return(
        <>
            <div className="btn-box mb_md sort-box">
                {direction === ",asc" ? (
                    <button className="btn btn-xsm btn-s-l"
                            onClick={() => changeDirection(",desc")}>
                        ▲
                    </button>
                ) : (
                    <button className="btn btn-xsm btn-s-l"
                            onClick={() => changeDirection(",asc")}>
                        ▼
                    </button>
                )}
                <button className={sort === "id" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                        onClick={() => changeSort("id")}>번호 순
                </button>
                <button className={sort === "memberId" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                        onClick={() => changeSort("memberId")}>회원 순
                </button>
                <button className={sort === "campId" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                        onClick={() => changeSort("campId")}>캠핑장 순
                </button>
                <button className={sort === "reservationDate" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                        onClick={() => changeSort("reservationDate")}>예약일 순
                </button>
                <button className={sort === "usageDate" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                        onClick={() => changeSort("usageDate")}>사용일 순
                </button>
            </div>
            <form className="dashboard-form">
                <table>
                    <colgroup>
                        <col/>
                        <col/>
                        <col/>
                        <col/>
                        <col/>
                        <col/>
                        <col/>
                        <col/>
                    </colgroup>
                    <thead>
                    <tr>
                        <td><input type="checkbox" className="check-all" checked={selectAll}
                                   onChange={handleSelectAll}/></td>
                        <td>순번</td>
                        <td>회원 번호</td>
                        <td>회원 이메일</td>
                        <td>캠핑장 번호</td>
                        <td>캠핑장 이름</td>
                        <td>예약일</td>
                        <td>사용일</td>
                        <td>삭제</td>
                    </tr>
                    </thead>
                    <tbody>
                    {res.map(item => (
                        <tr key={item.id}>
                            <>
                                <td><input type="checkbox" className="checkbox"
                                           checked={selectedRes.includes(item.id)}
                                           onChange={() => handleSelectRes(item.id)}/></td>
                                <td>{item.id}</td>
                                <td>{item.memberId}</td>
                                <td>{item.memberEmail}</td>
                                <td>{item.campId}</td>
                                <td>{item.campName}</td>
                                <td>{new Date(item.reservationDate).toLocaleDateString()}</td>
                                <td>{new Date(item.usageDate).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="btn btn-e-l btn-xsm"
                                        onClick={(e) => {
                                            deleteRes(e,item.id)
                                        }}
                                    >
                                        삭제
                                    </button>
                                </td>
                            </>
                        </tr>
                    ))}
                    </tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <button type="btn btn-e-l btn-xsm" className="btn btn-e-l btn-xsm"
                                    onClick={handleBulkDelete}>
                                선택 삭제
                            </button>
                        </td>
                    </tr>
                </table>

                <div className="bar"></div>
                <div>
                    <div className="item-box mt_md">
                        <Pagination
                            className="pagination"
                            activePage={page}
                            itemsCountPerPage={pageSize}
                            totalItemsCount={totalCnt}
                            pageRangeDisplayed={5}
                            prevPageText={"‹"}
                            nextPageText={"›"}
                            onChange={changePage}
                        />

                    </div>
                </div>
            </form>
        </>
    );
}
export default AdminReservationBoard;