import React, { useEffect, useState, useContext } from 'react';
import { SwiperSlide, Swiper } from 'swiper/react';
import axios from 'axios';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import { Autoplay } from 'swiper/modules';

function ReviewArea() {
  const { memberId } = useParams(); // useParams()는 함수 형태로 호출해야 함
  const { auth, setAuth } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]); // 리뷰 데이터를 상태로 저장

  // 리뷰 데이터를 불러오는 함수
  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/review/list?page=0&size=5' // 리뷰 리스트 API 요청
      );

      let filteredReviews = [];

      if (memberId !== String(auth)) {
        // 현재 URL의 memberId가 로그인한 회원의 ID와 다르면 해당 memberId의 리뷰만 가져오기
        filteredReviews = response.data.content.filter(
          (review) => String(review.memberId) === String(memberId)
        );
      } else {
        // 같다면 로그인한 회원의 리뷰만 가져오기
        filteredReviews = response.data.content.filter(
          (review) => String(review.memberId) === String(auth)
        );
      }

      setReviews(filteredReviews); // 필터링된 데이터를 상태에 저장
    } catch (error) {
      console.error('리뷰 불러오기 오류:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [memberId]); // memberId가 변경될 때마다 다시 불러오기

  return (
    <div className="item-area pt_xlg">
      <h3 className="fs_xlg mb_sm">작성한 리뷰</h3>
      <div className="bar mb_lg"></div>

      <div style={{ width: '25vw' }}>
        {/* 리뷰가 없는 경우 */}
        {reviews.length === 0 ? (
          <div className="empty">
            <p className="fs_xlg mb_lg">작성한 리뷰가 없습니다</p>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay]}
            className={'review-swiper'}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: true,
            }}
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={`${review.id}-${index}`}>
                {' '}
                {/* 고유한 key 값 설정 */}
                <Link to={`/review/${review.reviewId}`}>
                  <div className="image-area">
                    <img
                      src={
                        review.reviewImages && review.reviewImages.length > 0
                          ? review.reviewImages[0].filePath
                          : '/images/review/noimage.png'
                      }
                      alt="썸네일"
                    />
                  </div>
                  <div className="txt-area">
                    <p className="camp-name">{review.campName}</p>
                    <p className="review-title">{review.reviewTitle}</p>
                    <div className="review-date">{review.createdDate}</div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}

export default ReviewArea;
