import {useContext, useEffect, useState} from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import {HttpHeadersContext} from "../context/HttpHeadersProvider";

function AdminCommentBoard(){
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCnt, setTotalCnt] = useState(0);
    const [ sort,setSort ] = useState("commentId");
    const [ direction,setDirection ] = useState(",desc");

    const [selectAll, setSelectAll] = useState(false);
    const [selectedComments, setSelectedComments] = useState([]);

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
        getComments(page,sort || "commentId");
    }, [sort,direction]);

    // Paging
    const getComments = async (page, sort) => {
        await axios.get("http://localhost:8080/admin/comment", { params: { "page": page -1, "sort" : sort + direction, "size" : 15 }, headers: headers, })
            .then(response => {
                setComments(response.data.content);
                setSelectedComments([]);
                setPageSize(response.data.pageSize);
                setTotalCnt(response.data.totalElements);
                console.log("[AdminCommentBoard] getComments() success :")
                console.log(response.data.content)
            })
            .catch(error => {
                console.log("[AdminCommentBoard] getComments() error :")
                console.error("댓글 조회 실패 : ", error);
            })
    }

    const deleteComment= async (e,commentId) => {
        e.preventDefault()
        if (window.confirm("댓글을 삭제하시겠습니까?")) {
            await axios.delete(`http://localhost:8080/admin/comment/${commentId}/delete`, { headers: headers, })
                .then(response => {
                    console.log(response.data);
                    getComments(page, sort);
                })
                .catch(error => {
                    console.error("댓글 삭제 중 오류 발생 : ", error);
                })
        }
    }


    const handleSelectComment = (commentId) => {
        setSelectedComments(prevSelected =>
            prevSelected.includes(commentId)
                ? prevSelected.filter(id => id !== commentId)
                : [...prevSelected, commentId]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedComments([]);
        } else {
            setSelectedComments(comments.map((comment) => comment.commentId));
        }
        setSelectAll(!selectAll);
    };

    const handleBulkDelete = async (e) => {
        e.preventDefault();
        if (selectedComments.length === 0) {
            alert("삭제할 댓글을 선택해주세요.");
            return;
        }
        if (window.confirm("선택한 댓글을 삭제하시겠습니까?")) {
            await Promise.all(selectedComments.map(commentId => axios.delete(`http://localhost:8080/admin/comment/${commentId}/delete`, {headers: headers,} )))
                .then(() => {
                    alert("선택한 댓글이 삭제되었습니다.");
                    getComments(sort,direction);
                })
                .catch(error => {
                    console.error("일괄 삭제 중 오류 발생 : ", error);
                });
        }
    };

    // 페이징 보여주기
    const changePage = (page) => {
        setPage(page);
        getComments(page ,sort);
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
                <button className={sort === "commentId" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                        onClick={() => changeSort("commentId")}>번호 순
                </button>
                <button className={sort === "reviewId" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                        onClick={() => changeSort("reviewId")}>리뷰 순
                </button>
                <button className={sort === "memberId" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                        onClick={() => changeSort("memberId")}>회원 순
                </button>
                <button className={sort === "createdDate" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                        onClick={() => changeSort("createdDate")}>작성일 순
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
                        <td>회원 번호</td>
                        <td>회원 이름</td>
                        <td>리뷰 번호</td>
                        <td>리뷰 제목</td>
                        <td>댓글 내용</td>
                        <td>작성일</td>
                        <td>삭제</td>
                    </tr>
                    </thead>
                    <tbody>
                    {comments.map(comment => (
                        <tr key={comment.commentId}>
                            <>
                                <td><input type="checkbox" className="checkbox"
                                           checked={selectedComments.includes(comment.commentId)}
                                           onChange={() => handleSelectComment(comment.commentId)}/></td>
                                <td>{comment.commentId}</td>
                                <td>{comment.memberId}</td>
                                <td>{comment.memberName}</td>
                                <td>{comment.reviewId}</td>
                                <td>{comment.reviewTitle}</td>
                                <td>{comment.commentContent}</td>
                                <td>{new Date(comment.createdDate).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="btn btn-e-l btn-xsm"
                                        onClick={(e) => {
                                            deleteComment(e,comment.commentId)
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
                    <div className="comment-box mt_md">
                        <Pagination
                            className="pagination"
                            activePage={page}
                            commentsCountPerPage={pageSize}
                            totalcommentsCount={totalCnt}
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
export default AdminCommentBoard;