import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router';

function ReviewLikeBtn({ reviewId, setReviewLikes }) {
  const [isActive, setIsActive] = useState(false);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlerActive = () => {
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
    setIsActive((prev) => !prev);
    console.log(isActive);
  };

  const upLikeCount = async () => {
    try {
      await axios.get(`http://localhost:8080/review/uplike`, {
        params: { reviewId: reviewId },
      });
      console.log('[ReviewLikeBtn] upLikeCount success.');
    } catch (error) {
      console.log('[ReviewLikeBtn] upLikeCount error.');
      console.error(error);
    }
  };
  const downLikeCount = async () => {
    try {
      await axios.get(`http://localhost:8080/review/downlike`, {
        params: { reviewId: reviewId },
      });
      console.log('[ReviewLikeBtn] downLikeCount success.');
    } catch (error) {
      console.log('[ReviewLikeBtn] downLikeCount error.');
      console.error(error);
    }
  };

  return (
    <div
      id="like-btn"
      className={isActive ? 'icon active' : 'icon'}
      onClick={(e) => {
        e.preventDefault();
        handlerActive();
        {
          isActive ? downLikeCount() : upLikeCount();
        }
      }}
    >
      {isActive ? '❤️' : '🤍'}
    </div>
  );
}

export default ReviewLikeBtn;
