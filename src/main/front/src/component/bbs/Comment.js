import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../../css/review-detail.css';
import '../../css/style.css';
import { AuthContext } from '../context/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import { HttpHeadersContext } from '../context/HttpHeadersProvider';

const Comment = ({ reviewId }) => {
  const { auth, setAuth } = useContext(AuthContext);
  const [commentContent, setCommentContent] = useState(''); // 댓글 내용
  const [commentList, setCommentList] = useState([]); // 댓글 목록
  const [totalComments, setTotalComments] = useState(0); // 전체 댓글 수
  const [page, setPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [memberId, setMemberId] = useState(localStorage.getItem('id'));
  const [profilePaths, setProfilePaths] = useState({}); // 각 댓글 작성자별 프로필 경로
  const { headers, setHeaders } = useContext(HttpHeadersContext);
  const navigate = useNavigate();

  // 댓글 데이터를 가져오는 함수
  const fetchCommentData = async (page = 0) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/review/${reviewId}/comments/list?page=${page}&size=5`
      );
      setCommentList(response.data.content); // 댓글 목록 상태 업데이트
      setTotalComments(response.data.totalElements); // 전체 댓글 수
      setTotalPages(response.data.totalPages); // 전체 페이지 수

      // 각 댓글 작성자 프로필 경로 가져오기
      const profilePromises = response.data.content.map((comment) =>
        axios
          .get(`http://localhost:8080/member/getProfile/${comment.memberId}`, {
            headers: headers,
          })
          .then((res) => ({
            memberId: comment.memberId,
            profilePath: res.data,
          }))
          .catch((err) => {
            console.error('프로필 경로 가져오기 실패:', err);
            return { memberId: comment.memberId, profilePath: '' }; // 기본 값 처리
          })
      );

      // 프로필 경로 업데이트
      const profileData = await Promise.all(profilePromises);
      const profilePaths = profileData.reduce(
        (acc, { memberId, profilePath }) => {
          acc[memberId] = profilePath;
          return acc;
        },
        {}
      );
      setProfilePaths(profilePaths); // 상태에 저장
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth) {
      if (
        window.confirm(
          '로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.'
        )
      ) {
        navigate('/login'); // 로그인 페이지로 이동
      }
      return;
    }

    const commentData = {
      commentContent,
      reviewId,
      memberId: auth, // auth 정보를 여기에 넣어야 함
      createdDate: new Date().toISOString(),
    };
    try {
      await axios.post(
        `http://localhost:8080/review/${reviewId}/comments/write`,
        commentData
      );
      alert('댓글을 등록했습니다.');
      fetchCommentData(page); // 댓글 등록 후 새로 고침
      setCommentContent('');
    } catch (error) {
      console.error('댓글 등록 실패:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 정말 삭제하시겠습니까?')) return;

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

  const changePage = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return;
    setPage(newPage);
    fetchCommentData(newPage); // 새로운 페이지 데이터 불러오기
  };

  const changeCommentContent = (event) => {
    setCommentContent(event.target.value);
  };

  // 컴포넌트 마운트 시 댓글 데이터 불러오기
  useEffect(() => {
    fetchCommentData(page);
  }, [reviewId, page]);

  return (
    <>
      <div className="comment_wrap">
        <div className="empty not mb_lg">
          <p className="fs_lg txt-a-c">등록된 댓글이 없습니다</p>
        </div>

        <ul className="comment_list">
          {commentList.length > 0 ? (
            commentList.map((comment) => (
              <li className="comment" key={comment.commentId}>
                <div className="profile-area">
                  <div className="profile-img">
                    {profilePaths[comment.memberId] ? (
                      <img
                        src={`http://localhost:8080/uploads/${
                          profilePaths[comment.memberId]
                        }`}
                        alt="프로필 이미지"
                      />
                    ) : (
                      <img
                        src="/images/review/profile_no_image.jpg"
                        alt="로그인"
                      />
                    )}
                  </div>
                  <Link to={`/memberDetail/${comment.memberId}`}>
                    <p className="user-name">{comment.memberName}</p>
                  </Link>
                </div>
                <div className="comment-content">
                  <p className="fs_lg">{comment.commentContent}</p>
                  <p className="date mt_sm">{comment.createdDate}</p>
                  {auth == comment.memberId && (
                    <button
                      className="btn-e-l btn btn-xsm mt_sm"
                      onClick={() => handleDeleteComment(comment.commentId)}
                    >
                      댓글 삭제
                    </button>
                  )}
                </div>
              </li>
            ))
          ) : (
            <p>댓글이 없습니다</p>
          )}
        </ul>

        <div
          className="pagination"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <button onClick={() => changePage(page - 1)} disabled={page === 0}>
            &lt;
          </button>
          <span>
            {page + 1} / {totalPages > 0 ? totalPages : 1}
          </span>
          <button
            onClick={() => changePage(page + 1)}
            disabled={page === totalPages - 1}
          >
            &gt;
          </button>
        </div>
        <br />

        <div className="comment_new">
          <form onSubmit={handleSubmit} className="comment-form">
            <textarea
              value={commentContent}
              onChange={changeCommentContent}
              className="textarea"
              placeholder="댓글 입력"
            ></textarea>

            <input type="submit" value="댓글 등록" />
          </form>
        </div>
      </div>
    </>
  );
};

export default Comment;
