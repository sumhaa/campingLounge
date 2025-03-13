import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { AuthContext } from '../context/AuthProvider';
import { Link } from 'react-router-dom';

function CommentArea() {
  const { memberId } = useParams(); // URL에서 memberId 가져오기
  const { auth } = useContext(AuthContext); // 로그인한 회원 정보 가져오기
  const [commentList, setCommentList] = useState([]); // 댓글 목록
  const [page, setPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [totalComments, setTotalComments] = useState(0); // 전체 댓글 수

  // 댓글 데이터를 가져오는 함수
  const fetchCommentData = async (page = 0) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/review/comments/list?page=${page}&size=5&memberId=${memberId}`
      );
      setCommentList(response.data.content); // 댓글 목록 업데이트
      setTotalPages(response.data.totalPages); // 전체 페이지 수 업데이트
      setTotalComments(response.data.totalElements); // 전체 댓글 수 업데이트
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const changePage = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return; // 페이지 범위 체크
    setPage(newPage);
    fetchCommentData(newPage); // 새로운 페이지의 데이터 불러오기
  };

  useEffect(() => {
    fetchCommentData(page);
  }, [memberId, page]); // memberId나 페이지가 변경될 때마다 댓글 데이터 불러오기

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 정말 삭제하시겠습니까?')) return;
    const reviewId = commentList.reviewId;

    try {
      await axios.delete(
        `http://localhost:8080/review/${reviewId}/comments/delete/${commentId}`
      );
      alert('댓글이 삭제되었습니다.');
      fetchCommentData(page); // 삭제 후 댓글 목록 새로 불러오기
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제 실패했습니다.');
    }
  };

  return (
    <div className="item-area pt_xlg">
      <h3 className="fs_xlg mb_sm">작성한 댓글</h3>
      <div className="bar mb_lg"></div>

      {commentList.length === 0 ? (
        <div className="empty">
          <p className="fs_xlg mb_lg">작성한 댓글이 없습니다</p>
        </div>
      ) : (
        <div className="comment_wrap">
          <table className="member-detail-table">
            <colgroup>
              <col width="40%" />
              <col width="30%" />
              <col width="15%" />
              <col width="15%" />
            </colgroup>
            <thead>
              <tr>
                <th>댓글 내용</th>
                <th>작성글</th>
                <th>작성일</th>
                {memberId === String(auth) && <th>삭제</th>}
              </tr>
            </thead>
            <tbody>
              {commentList.map((comment) => (
                <tr key={comment.commentId}>
                  <td>{comment.commentContent}</td>
                  <td>
                    <Link to={`/review/${comment.reviewId}`}>
                      {comment.reviewTitle}
                    </Link>
                  </td>
                  <td>{comment.createdDate}</td>
                  <td>
                    {memberId === String(auth) && (
                      <button
                        className="btn btn-e-l btn-xsm mlr-a"
                        onClick={() =>
                          handleDeleteComment(
                            comment.commentId,
                            comment.memberId
                          )
                        }
                      >
                        삭제
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 🚀 페이지네이션 UI */}
          <div className="paging mt_md">
            <button
              className="fs_md"
              onClick={() => changePage(page - 1)}
              disabled={page === 0}
            >
              &lt;
            </button>
            {page + 1} / {totalPages > 0 ? totalPages : 1}
            <button
              className="fs_md"
              onClick={() => changePage(page + 1)}
              disabled={page === totalPages - 1}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentArea;
