import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../css/review-detail.css';
import '../../css/style.css';

import { AuthContext } from '../context/AuthProvider';
import Comment from './Comment';
import ReviewLikeBtn from './ReviewLikeBtn';

const ReviewDetail = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const { reviewId } = useParams(); // URL에서 reviewId를 가져옵니다.
  const [review, setReview] = useState({}); // 리뷰 데이터 저장
  const navigate = useNavigate();
  const isFetched = useRef(false);

  // 리뷰 데이터를 가져오는 함수
  const fetchReviewData = async () => {
    if (isFetched.current) return; // 이미 데이터 가져왔으면 중단
    isFetched.current = true;

    try {
      const reviewResponse = await axios.get(
        `http://localhost:8080/review/${reviewId}`
      );
      setReview(reviewResponse.data); // 리뷰 데이터 상태 업데이트

      console.log('리뷰 데이터', JSON.stringify(reviewResponse.data));
    } catch (error) {
      console.error('Error fetching review data:', error);
    }
  };

  // 컴포넌트 마운트 시 데이터 불러오기
  useEffect(() => {
    fetchReviewData();
  }, [auth, reviewId]);

  const handleDeleteReview = async (reviewId) => {
    if (!reviewId) {
      alert('삭제할 리뷰가 없습니다.');
      return;
    }

    if (!window.confirm('리뷰를 정말 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`http://localhost:8080/review/${reviewId}/delete`);
      alert('리뷰가 삭제되었습니다.');
      navigate('/review/list');
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      alert('리뷰 삭제 실패했습니다.');
    }
  };

  return (
    <main id="main" className="review-detail">
      <section className="sec">
        <div className="inner_02">
          <div className="container">
            {/* 리뷰 정보 및 만족도 조사 */}
            <div className="head-area">
              <div className="writer">
                <button className="btn-p-f btn btn-xsm">
                  <Link to={`/memberDetail/${review.memberId}`}>
                    {review.memberName}{' '}
                  </Link>
                </button>

                {review.memberId == String(auth) && (
                  <button className="btn-s-l btn btn-xsm">
                    <Link to={`/review/${reviewId}/update`}>수정하기</Link>
                  </button>
                )}

                {review.memberId == String(auth) && (
                  <button
                    className="btn-e-l btn btn-xsm"
                    onClick={() => handleDeleteReview(review.reviewId)}
                  >
                    리뷰 삭제
                  </button>
                )}
              </div>
              <div className="date">
                <p className="fs_md">
                  {review ? review.createdDate : '리뷰 작성일'}
                </p>
                <p className="fs_md">
                  {review ? review.reviewHit : '0'} 명이 이 글을 읽었어요!
                </p>
                <br />
                <p className="fs_md">
                  {review ? review.reviewLikes : '0'} 명이 이 글을 좋아해요!
                </p>
                <br />
                <ReviewLikeBtn reviewId={reviewId} />
              </div>
            </div>
            <div className="title-area">
              <h3 className="fs_xlg txt-a-c">
                {review ? review.reviewTitle : '리뷰 제목'}
              </h3>
              <div className="bar bar-lg mt_sm"></div>
            </div>
            <div className="content-area">
              <p className="fs_lg mb_md hidden">캠핑장 정보</p>
              <div className="item_wrap">
                <div className="info_wrap img-area">
                  <Link to="./camp-detail.html">
                    <img src={`${review.campThumb?.[0]?.filePath}`} alt="" />
                  </Link>
                </div>
                <div className="info_wrap">
                  <ul className="info_list">
                    <li>
                      <p className="fs_lg">
                        <b>캠핑장</b>{' '}
                        <Link to={`/camp/${review.campId}`}>
                          {review.campName}
                        </Link>
                      </p>
                    </li>
                    <li>
                      <p className="fs_lg">
                        <b>위치</b> {review.campLocation}
                      </p>
                    </li>
                    <li>
                      <p className="fs_lg">
                        <b>방문일</b>{' '}
                        {review.resDate ? review.resDate.slice(0, 10) : ''}
                      </p>
                    </li>
                    <li>
                      <p className="fs_lg">
                        <b>만족도</b>
                        {review.reviewSatisfaction === 1
                          ? ' 매우 불만족해요'
                          : review.reviewSatisfaction === 2
                          ? ' 불만족해요'
                          : review.reviewSatisfaction === 3
                          ? ' 보통이에요'
                          : review.reviewSatisfaction === 4
                          ? ' 만족해요'
                          : review.reviewSatisfaction === 5
                          ? ' 완전 만족해요'
                          : '만족도 불러오는 중'}
                      </p>
                    </li>
                    <li>
                      <p className="fs_lg">
                        <b>사이트 크기</b>
                        {review.reviewSize === 1
                          ? ' 매우 좁아요'
                          : review.reviewSize === 2
                          ? ' 좁아요'
                          : review.reviewSize === 3
                          ? ' 충분해요'
                          : review.reviewSize === 4
                          ? ' 넓어요'
                          : review.reviewSize === 5
                          ? ' 완전 넓어요'
                          : '만족도 불러오는 중'}
                      </p>
                    </li>
                    <li>
                      <p className="fs_lg">
                        <b>청결도</b>{' '}
                        {review.reviewClean === 1
                          ? '더러워요'
                          : review.reviewClean === 2
                          ? '지저분해요'
                          : review.reviewClean === 3
                          ? '보통이에요'
                          : review.reviewClean === 4
                          ? '깨끗해요'
                          : review.reviewClean === 5
                          ? '완전 깨끗해요'
                          : '만족도 불러오는 중'}
                      </p>
                    </li>
                    <li>
                      <p className="fs_lg">
                        <b>친절함</b>{' '}
                        {review.reviewKindness === 1
                          ? ' 완전 불친절해요'
                          : review.reviewKindness === 2
                          ? ' 불친절해요'
                          : review.reviewKindness === 3
                          ? ' 보통이에요'
                          : review.reviewKindness === 4
                          ? ' 친절해요'
                          : review.reviewKindness === 5
                          ? ' 완전 친절해요'
                          : '만족도 불러오는 중'}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bar mt_lg mb_lg"></div>
              <div className="content">
                {/* ✅ 이미지 가운데 정렬 + 줄바꿈 */}
                {review?.reviewImages?.map((image) => (
                  <img
                    key={image.reviewFilesId}
                    src={image.filePath} // 클라이언트에서 바로 접근할 수 있는 상대 경로
                    alt={image.originFileName}
                  />
                ))}
                <div
                  className="fs_md"
                  dangerouslySetInnerHTML={{
                    __html: review ? review.reviewContent : '리뷰 내용',
                  }}
                />
                <div
                  className="review-images"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bar mt_lg mb_lg"></div>
          {/* 댓글 컴포넌트 */}
          <Comment reviewId={reviewId} />
        </div>
        <br />
        <div className="foot-area">
          <button className="btn btn-lg btn-p mlr-a">
            <Link to="/list">목록으로</Link>
          </button>
        </div>
      </section>
    </main>
  );
};

export default ReviewDetail;
