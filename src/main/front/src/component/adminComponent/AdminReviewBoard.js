import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import {Link, useNavigate} from "react-router-dom";
import {HttpHeadersContext} from "../context/HttpHeadersProvider";

function AdminReviewBoard(){

    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCnt, setTotalCnt] = useState(0);
    const [ sort,setSort ] = useState("reviewId");
    const [ direction,setDirection ] = useState(",desc");

    const [selectAll, setSelectAll] = useState(false);
    const [selectedReviews, setSelectedReviews] = useState([]);

    const token = localStorage.getItem("CL_access_token");
    const { headers, setHeaders } = useContext(HttpHeadersContext);

    const navigate = useNavigate();

    const changeSort= (param)=>{
        setSort(param)
    }
    const changeDirection= (param)=>{
        setDirection(param)
    }

    useEffect(() => {
        getReviews(page,sort || "reviewId");
    }, [sort,direction]);

    useEffect(() => {
        setHeaders({ "Authorization": `Bearer ${token}` });
    }, []);

    // Paging
    const getReviews = async (page, sort) => {
        await axios.get("http://localhost:8080/admin/review", {
            params: { "page": page - 1, "sort": sort + direction, "size": 15 },
            headers: headers
        })
            .then(response => {
                setReviews(response.data.content);
                setSelectedReviews([]);
                setPageSize(response.data.pageSize);
                setTotalCnt(response.data.totalElements);
                console.log("[AdminReviewBoard] getReviews() success :")
                console.log(response.data.content)
            })
            .catch(error => {
                console.log("[AdminReviewBoard] getReviews() error :")
                console.error("리뷰 조회 실패 : ", error);
            })
    }

    const deleteReview= async (e,reviewId) => {
        e.preventDefault()
        if (window.confirm("리뷰을 삭제하시겠습니까?")) {
            await axios.delete(`http://localhost:8080/admin/review/${reviewId}/delete`, {headers})
                .then(response => {
                    console.log(response.data);
                    getReviews(page, sort);
                })
                .catch(error => {
                    console.error("리뷰 삭제 중 오류 발생 : ", error);
                })
        }
    }


    const handleSelectReview = (reviewId) => {
        setSelectedReviews(prevSelected =>
            prevSelected.includes(reviewId)
                ? prevSelected.filter(id => id !== reviewId)
                : [...prevSelected, reviewId]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedReviews([]);
        } else {
            setSelectedReviews(reviews.map((review) => review.reviewId));
        }
        setSelectAll(!selectAll);
    };

    const handleBulkDelete = async (e) => {
        e.preventDefault();
        if (selectedReviews.length === 0) {
            alert("삭제할 리뷰를 선택해주세요.");
            return;
        }
        if (window.confirm("선택한 리뷰를 삭제하시겠습니까?")) {
            await Promise.all(selectedReviews.map(reviewId => axios.delete(`http://localhost:8080/admin/review/${reviewId}/delete`, {headers})))
                .then(() => {
                    alert("선택한 리뷰가 삭제되었습니다.");
                    getReviews(sort,direction);
                })
                .catch(error => {
                    console.error("일괄 삭제 중 오류 발생 : ", error);
                });
        }
    };

    // 페이징 보여주기
    const changePage = (page) => {
        setPage(page);
        getReviews(page ,sort);
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
                <button className={sort === "reviewId" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                        onClick={() => changeSort("reviewId")}>번호 순
                </button>
                <button className={sort === "reviewTitle" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                        onClick={() => changeSort("reviewTitle")}>제목 순
                </button>
                <button className={sort === "memberId" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                        onClick={() => changeSort("memberId")}>회원 순
                </button>
                <button className={sort === "campId" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                        onClick={() => changeSort("campId")}>캠핑장 순
                </button>
                <button className={sort === "reviewHit" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                        onClick={() => changeSort("reviewHit")}>조회수 순
                </button>
                <button className={sort === "modifiedDate" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                        onClick={() => changeSort("modifiedDate")}>작성일 순
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
                        <col/>
                    </colgroup>
                    <thead>
                    <tr>
                        <td><input type="checkbox" className="check-all" checked={selectAll}
                                   onChange={handleSelectAll}/></td>
                        <td>순번</td>
                        <td>제목</td>
                        <td>회원 번호</td>
                        <td>회원 이름</td>
                        <td>캠핑장 번호</td>
                        <td>캠핑장 이름</td>
                        <td>조회수</td>
                        <td>작성일</td>
                        <td>바로가기</td>
                        <td>삭제</td>
                    </tr>
                    </thead>
                    <tbody>
                    {reviews.map(review => (
                        <tr key={review.reviewId}>
                            <>
                                <td><input type="checkbox" className="checkbox"
                                           checked={selectedReviews.includes(review.reviewId)}
                                           onChange={() => handleSelectReview(review.reviewId)}/></td>
                                <td>{review.reviewId}</td>
                                <td>{review.reviewTitle}</td>
                                <td>{review.memberId}</td>
                                <td>{review.memberName}</td>
                                <td>{review.campId}</td>
                                <td>{review.campName}</td>
                                <td>{review.reviewHit}</td>
                                <td>{new Date(review.modifiedDate).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="btn btn-p-f btn-xsm"
                                        onClick={()=>navigate(`/review/${review.reviewId}`)}
                                    >
                                        바로가기
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-e-l btn-xsm"
                                        onClick={(e) => {
                                            deleteReview(e,review.reviewId)
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
                    <div className="review-box mt_md">
                        <Pagination
                            className="pagination"
                            activePage={page}
                            reviewsCountPerPage={pageSize}
                            totalreviewsCount={totalCnt}
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
export default AdminReviewBoard;