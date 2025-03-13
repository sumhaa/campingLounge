import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '../../css/style.css';
import '../../css/review-new.css';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
Quill.register('modules/ImageResize', ImageResize);

const ReviewWrite = () => {
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewSatisfaction, setReviewSatisfaction] = useState(null);
  const [reviewSize, setReviewSize] = useState(null);
  const [reviewClean, setReviewClean] = useState(null);
  const [reviewKindness, setReviewKindness] = useState(null);
  const [files, setFiles] = useState([]);
  const location = useLocation();
  const { memberId, campId, reservationId, reservationDate } = location.state;
  const [campName, setCampName] = useState('');
  const [campLocation, setCampLocation] = useState('');

  const navigate = useNavigate(); // useNavigate 사용
  const quillRef = useRef();

  // 제목 변경 핸들러
  const changeTitle = (event) => {
    setReviewTitle(event.target.value);
  };

  // 내용 변경 핸들러
  const changeContent = (value) => {
    if (value !== undefined && value !== null) {
      setReviewContent(value);
    } else {
      console.error('Editor value is undefined or null');
    }
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reviewTitle.trim()) {
      alert('제목을 입력해주세요');
      return;
    }

    if (
      reviewSatisfaction === null ||
      reviewSize === null ||
      reviewClean === null ||
      reviewKindness === null
    ) {
      alert('설문 항목을 확인해주세요');
      return;
    }

    try {
      const reviewData = {
        reviewTitle,
        reviewContent,
        reviewSatisfaction,
        reviewSize,
        reviewClean,
        reviewKindness,
        memberId: Number(memberId),
        reservationId: Number(reservationId),
        campId: Number(campId),
      };

      const response = await axios.post(
        'http://localhost:8080/review/post',
        reviewData
      );
      const reviewId = response.data.reviewId;

      if (!reviewId) {
        throw new Error('리뷰 ID를 받을 수 없습니다.');
      }

      if (files.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
        try {
          const resFile = await axios.post(
            `http://localhost:8080/review/${reviewId}/image/upload`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
        } catch (error) {
          console.log('파일 업로드 실패');
          console.log(error);
        }
        alert('리뷰를 등록했습니다.');
      } else {
        alert('리뷰를 등록했습니다.');
      }
      navigate(`/review/${reviewId}`);
    } catch (err) {
      alert('리뷰 등록에 실패했습니다. 제목과 설문 항목을 확인해주세요');
    }
  };

  // 설문 응답 처리
  const handleRadioChange = (setter, value) => {
    setter(value);
  };

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  // 캠핑장 정보 가져오기
  useEffect(() => {
    const fetchCamp = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/camp/${campId}`
        );
        setCampName(response.data.campName);
        setCampLocation(response.data.campAddress1);
      } catch (error) {
        console.error('캠핑장 이름을 가져오는 데 실패했습니다:', error);
      }
    };
    fetchCamp();
  }, [campId]);

  // 취소 버튼 클릭 처리
  const handleCancel = () => {
    if (window.confirm('리뷰 등록을 취소하시겠습니까?')) {
      alert('등록이 취소되었습니다.');
      navigate(`/memberDetail/${memberId}`); // 취소 후 memberDetail 페이지로 이동
    }
  };

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      ['bold', 'underline'],
      ['image'],
      [{ color: [] }],
    ],
    ImageResize: {
      modules: ['Resize', 'DisplaySize'],
    },
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <main id="main" className="review-new">
      <section className="sec">
        <div className="inner_02">
          <form onSubmit={handleSubmit} className="review-new">
            <div className="container">
              <div className="head-area">
                <div className="writer">
                  <button
                    type="button"
                    className="btn-e-l btn btn-xsm"
                    onClick={handleCancel} // 취소 버튼 클릭 시 핸들러 호출
                  >
                    등록 취소
                  </button>
                </div>
              </div>
              <div className="title-area">
                <input
                  type="text"
                  className="input-txt input-xlg mlr-a txt-a-c"
                  placeholder="제목을 입력하세요"
                  name="title"
                  value={reviewTitle}
                  onChange={changeTitle}
                  maxLength={30}
                />
                <div className="bar bar-lg mt_sm"></div>
              </div>
              <div className="content-area">
                <p className="fs_lg mb_md hidden">캠핑장 정보</p>
                <div className="item_wrap">
                  <div className="info_wrap">
                    <ul className="info_list">
                      <li>
                        <p className="fs_lg">
                          <b>캠핑장</b>
                        </p>
                        <input
                          type="text"
                          className="input-txt input-xlg"
                          value={campName}
                          readOnly
                        />
                      </li>
                      <li>
                        <p className="fs_lg">
                          <b>위치</b>
                        </p>
                        <input
                          type="text"
                          className="input-txt input-xlg"
                          value={campLocation}
                          readOnly
                        />
                      </li>
                      <li>
                        <p className="fs_lg">
                          <b>방문일</b>
                        </p>
                        <input
                          type="text"
                          className="input-txt input-xlg"
                          value={new Date(reservationDate).toLocaleDateString()}
                          readOnly
                        />
                      </li>

                      <li>
                        <p className="fs_lg">
                          <b>만족도</b>
                        </p>

                        <ul className="radio_list radio-lg">
                          <li>
                            <input
                              type="radio"
                              name="radio_01"
                              id="radio_01_01"
                              value={1}
                              onChange={() =>
                                handleRadioChange(setReviewSatisfaction, 1)
                              }
                            />
                            <label htmlFor="radio_01_01">매우 불만족해요</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              name="radio_01"
                              id="radio_01_02"
                              value={2}
                              onChange={() =>
                                handleRadioChange(setReviewSatisfaction, 2)
                              }
                            />
                            <label htmlFor="radio_01_02">불만족해요</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              name="radio_01"
                              id="radio_01_03"
                              value={3}
                              onChange={() =>
                                handleRadioChange(setReviewSatisfaction, 3)
                              }
                            />
                            <label htmlFor="radio_01_03">보통이에요</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              name="radio_01"
                              id="radio_01_04"
                              value={4}
                              onChange={() =>
                                handleRadioChange(setReviewSatisfaction, 4)
                              }
                            />
                            <label htmlFor="radio_01_04">만족해요</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              name="radio_01"
                              id="radio_01_05"
                              value={5}
                              onChange={() =>
                                handleRadioChange(setReviewSatisfaction, 5)
                              }
                            />
                            <label htmlFor="radio_01_05">완전 만족해요</label>
                          </li>
                        </ul>
                      </li>
                      {/* 사이트 크기 */}
                      <li>
                        <p className="fs_lg">
                          <b>사이트 크기</b>
                        </p>
                        <ul className="radio_list radio-lg">
                          <li>
                            <input
                              type="radio"
                              name="radio_02"
                              id="radio_02_01"
                              value={1}
                              onChange={() =>
                                handleRadioChange(setReviewSize, 1)
                              }
                            />
                            <label htmlFor="radio_02_01">매우 좁아요</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              name="radio_02"
                              id="radio_02_02"
                              value={2}
                              onChange={() =>
                                handleRadioChange(setReviewSize, 2)
                              }
                            />
                            <label htmlFor="radio_02_02">좁아요</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              name="radio_02"
                              id="radio_02_03"
                              value={3}
                              onChange={() =>
                                handleRadioChange(setReviewSize, 3)
                              }
                            />
                            <label htmlFor="radio_02_03">충분해요</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              name="radio_02"
                              id="radio_02_04"
                              value={4}
                              onChange={() =>
                                handleRadioChange(setReviewSize, 4)
                              }
                            />
                            <label htmlFor="radio_02_04">넓어요</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              name="radio_02"
                              id="radio_02_05"
                              value={5}
                              onChange={() =>
                                handleRadioChange(setReviewSize, 5)
                              }
                            />
                            <label htmlFor="radio_02_05">완전 넓어요</label>
                          </li>
                        </ul>
                      </li>
                      {/* 청결도 */}
                      <li>
                        <p className="fs_lg">
                          <b>청결도</b>
                        </p>
                        <ul className="radio_list radio-lg">
                          <li>
                            <input
                              type="radio"
                              name="radio_03"
                              id="radio_03_01"
                              value={1}
                              onChange={() =>
                                handleRadioChange(setReviewClean, 1)
                              }
                            />
                            <label htmlFor="radio_03_01">더러워요</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              name="radio_03"
                              id="radio_03_02"
                              value={2}
                              onChange={() =>
                                handleRadioChange(setReviewClean, 2)
                              }
                            />
                            <label htmlFor="radio_03_02">지저분해요</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              name="radio_03"
                              id="radio_03_03"
                              value={3}
                              onChange={() =>
                                handleRadioChange(setReviewClean, 3)
                              }
                            />
                            <label htmlFor="radio_03_03">보통이에요</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              name="radio_03"
                              id="radio_03_04"
                              value={4}
                              onChange={() =>
                                handleRadioChange(setReviewClean, 4)
                              }
                            />
                            <label htmlFor="radio_03_04">깨끗해요</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              name="radio_03"
                              id="radio_03_05"
                              value={5}
                              onChange={() =>
                                handleRadioChange(setReviewClean, 5)
                              }
                            />
                            <label htmlFor="radio_03_05">완전 깨끗해요</label>
                          </li>
                        </ul>
                      </li>
                      {/* 친절함 */}
                      <li>
                        <p className="fs_lg">
                          <b>친절함</b>
                        </p>
                        <ul className="radio_list radio-lg">
                          <li>
                            <input
                              type="radio"
                              name="radio_04"
                              id="radio_04_01"
                              value={1}
                              onChange={() =>
                                handleRadioChange(setReviewKindness, 1)
                              }
                            />
                            <label htmlFor="radio_04_01">완전 불친절해요</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              name="radio_04"
                              id="radio_04_02"
                              value={2}
                              onChange={() =>
                                handleRadioChange(setReviewKindness, 2)
                              }
                            />
                            <label htmlFor="radio_04_02">불친절해요</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              name="radio_04"
                              id="radio_04_03"
                              value={3}
                              onChange={() =>
                                handleRadioChange(setReviewKindness, 3)
                              }
                            />
                            <label htmlFor="radio_04_03">보통이에요</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              name="radio_04"
                              id="radio_04_04"
                              value={4}
                              onChange={() =>
                                handleRadioChange(setReviewKindness, 4)
                              }
                            />
                            <label htmlFor="radio_04_04">친절해요</label>
                          </li>
                          <li>
                            <input
                              type="radio"
                              name="radio_04"
                              id="radio_04_05"
                              value={5}
                              onChange={() =>
                                handleRadioChange(setReviewKindness, 5)
                              }
                            />
                            <label htmlFor="radio_04_05">완전 친절해요</label>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bar mt_lg mb_lg"></div>

                <input
                  type="file"
                  multiple
                  accept=".jpg, .jpeg, .png, .svg, .heic, .webp"
                  className="input-txt input-max"
                  onChange={handleFileChange}
                />
                <br />
                <div className="content">
                  <ReactQuill
                    ref={quillRef}
                    value={reviewContent}
                    onChange={changeContent}
                    placeholder="내용을 입력해주세요"
                    theme="snow"
                    modules={modules}
                    style={{
                      height: '500px',
                    }}
                  />
                </div>
                <br />
                <br />
              </div>
              <div className="bar mt_lg mb_lg"></div>
              <div className="foot-area">
                <input
                  type="submit"
                  className="submit input-lg"
                  value="리뷰 등록"
                />
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ReviewWrite;
