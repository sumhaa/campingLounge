import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/review-list.css';
import '../../css/style.css';
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../../css/swiper.min.css';
import { Autoplay } from 'swiper/modules';
import ReviewLikeBtn from './ReviewLikeBtn';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]); // 리뷰 데이터를 저장할 상태
  const [page, setPage] = useState(0); // 현재 페이지
  const [bestReviews, setBestReviews] = useState([]); // 베스트 리뷰
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수

  // 리뷰 데이터를 불러오는 함수
  const fetchReviews = async (page = 0) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/review/list?page=${page}&size=9` // 한 페이지에 9개 리뷰 요청
      );
      setReviews(response.data.content); // 불러온 리뷰 데이터를 상태에 저장
      setTotalPages(response.data.totalPages); // 전체 페이지 수 상태 업데이트
      console.log('리뷰 데이터', JSON.stringify(response.data));
    } catch (error) {
      console.error('리뷰 불러오기 오류:', error);
    }
  };

  // 베스트 리뷰 데이터를 불러오는 함수
  const fetchBestReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/review/best?page=0&size=5` // 한 페이지에 5개 베스트 리뷰 요청
      );
      setBestReviews(response.data.content); // 베스트 리뷰 데이터를 상태에 저장
    } catch (error) {
      console.error('베스트 리뷰 불러오기 오류:', error);
    }
  };

  // 페이지 변경 시 리뷰 데이터 다시 불러오기
  const changePage = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return; // 페이지 범위 체크
    setPage(newPage);
    fetchReviews(newPage); // 새로운 페이지의 데이터 불러오기
  };

  // 컴포넌트 마운트 시 리뷰 데이터 불러오기
  useEffect(() => {
    fetchReviews(page); // 처음 페이지가 0이므로 이를 기준으로 데이터 불러오기
    fetchBestReviews(); // 베스트 리뷰 데이터도 불러오기
  }, [page]);

  console.log('이미지', reviews.reviewImages);

  return (
    <main id="main" className="review-list">
      <section className="sec">
        <div className="inner_02">
          <h3 className="title tit-md">베스트 리뷰 💚</h3>
          <div className="bar mt_md mb_lg"></div>

          <div style={{ width: '100%', boxSizing: 'border-box' }}>
            {/* Swiper 사용하여 자동 슬라이드 */}
            <Swiper
              modules={[Autoplay]}
              spaceBetween={25} // 슬라이드 간 간격
              slidesPerView={2} // 한 번에 1개의 슬라이드를 보여줌
              // 가운데 정렬
              autoplay={{
                delay: 3000, // 3초마다 슬라이드
                disableOnInteraction: true, // 슬라이드 중 사용자 인터랙션을 막지 않음
              }}
              loop={true} // 마지막 슬라이드에서 첫 번째로 돌아가는 루프
              className="best-review-swiper"
              style={{ overflow: 'hidden' }}
            >
              {/* 베스트 리뷰 리스트 */}
              {bestReviews.length > 0 ? (
                bestReviews.map((review) => (
                  <SwiperSlide key={review.reviewId}>
                    <Link
                      to={`/review/${review.reviewId}`}
                      className="best-review-link"
                    >
                      <div className="best-review">
                        <div className="item">
                          {/* 이미지 영역 */}
                          <div className="image-area">
                            <img
                              src={
                                review.reviewImages &&
                                review.reviewImages.length > 0
                                  ? review.reviewImages[0].filePath
                                  : '/images/review/noimage.png'
                              }
                              alt="썸네일"
                            />
                          </div>
                          {/* 텍스트 영역 */}
                          <div className="txt-area">
                            <h4 className="review-title">
                              {review.reviewTitle}
                            </h4>
                            <p className="camp-name">{review.campName}</p>
                            <p className="review-date">
                              {review.reviewPostingDate}
                            </p>
                            <p className="fs_md">조회수: {review.reviewHit}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="best-review">
                    <p>베스트 리뷰가 없습니다.</p>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="inner_02">
          <h3 className="title tit-md">리뷰 전체 보기</h3>
          <div className="bar mt_md mb_lg"></div>
          <div className="review_wrap">
            <ul className="review_list">
              {reviews.map((review) => (
                <li className="review" key={review.reviewId}>
                  <div className="wrap">
                    <Link to={`/review/${review.reviewId}`}>
                      <div className="img-area">
                        <img
                          src={
                            review.reviewImages &&
                            review.reviewImages.length > 0
                              ? review.reviewImages[0].filePath
                              : '/images/review/noimage.png'
                          }
                          alt="썸네일"
                        />
                        <div className="btn-box">
                          <ReviewLikeBtn reviewId={review.reviewId} />

                          <div id="share-btn" className="icon">
                            <img src="/images/review/share.svg" alt="" />
                          </div>
                        </div>
                      </div>
                      <div className="txt-area">
                        <h3 className="fs_lg mb_xsm">{review.reviewTitle}</h3>
                        <p className="fs_md">{review.campName}</p>
                        <p className="fs_md">{review.reviewPostingDate}</p>
                        <p className="fs_md">조회수: {review.reviewHit}</p>
                      </div>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="pagination" style={{ textAlign: 'center' }}>
        <button
          onClick={() => changePage(page - 1)}
          disabled={page === 0}
          style={{
            backgroundColor: 'transparent',
            color: '#16C47F',
            padding: '5px 10px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            opacity: page === 0 ? 0.5 : 1,
          }}
        >
          &lt;
        </button>
        <span style={{ fontSize: '16px', color: '#333' }}>
          {page + 1} / {totalPages > 0 ? totalPages : 1}
        </span>
        <button
          onClick={() => changePage(page + 1)}
          disabled={page === totalPages - 1}
          style={{
            backgroundColor: 'transparent',
            color: '#16C47F',
            padding: '5px 10px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            opacity: page === totalPages - 1 ? 0.5 : 1,
          }}
        >
          &gt;
        </button>
      </section>
    </main>
  );
};

export default ReviewList;
