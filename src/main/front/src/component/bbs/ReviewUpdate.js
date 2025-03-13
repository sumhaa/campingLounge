import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/style.css';
import '../../css/review-new.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
Quill.register('modules/ImageResize', ImageResize);

const ReviewUpdate = () => {
  const { reviewId } = useParams(); // URL에서 reviewId를 받아옴
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewSatisfaction, setReviewSatisfaction] = useState(null);
  const [reviewSize, setReviewSize] = useState(null);
  const [reviewClean, setReviewClean] = useState(null);
  const [reviewKindness, setReviewKindness] = useState(null);
  const [files, setFiles] = useState([]); // 파일 상태 추가
  const [existingImages, setExistingImages] = useState([]); // 기존 이미지 상태 추가
  const [campName, setCampName] = useState('');
  const [campLocation, setCampLocation] = useState('');
  const { campId } = useParams();
  const [resDate, setResDate] = useState('');

  const navigate = useNavigate();
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

  // 설문 응답 처리
  const handleRadioChange = (setter, value) => {
    setter(value);
  };

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // FileList를 배열로 변환
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // 기존 파일 유지
  };

  // 기존 리뷰 데이터 불러오기 (수정 페이지용)
  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/review/${reviewId}`
        );
        const reviewData = response.data;
        setReviewTitle(reviewData.reviewTitle);
        setReviewContent(reviewData.reviewContent);
        setReviewSatisfaction(reviewData.reviewSatisfaction);
        setReviewSize(reviewData.reviewSize);
        setReviewClean(reviewData.reviewClean);
        setReviewKindness(reviewData.reviewKindness);
        setCampName(reviewData.campName);
        setCampLocation(reviewData.campLocation);
        setResDate(reviewData.resDate);

        console.log('리뷰 데이터', reviewData);

        // 기존 이미지 URL 불러오기
        if (reviewData.reviewImages && reviewData.reviewImages.length > 0) {
          setExistingImages(reviewData.reviewImages); // 이미지 배열 설정
        }
      } catch (error) {
        console.log('Error fetching review data:', error);
        alert('리뷰 데이터를 불러오는데 실패했습니다.');
      }
    };

    fetchReviewData();
  }, [reviewId]);

  // 이미지 삭제 함수
  const handleImageDelete = async (reviewFilesId) => {
    try {
      // 백엔드에서 이미지 삭제 요청
      await axios.post('http://localhost:8080/review/image/delete', {
        reviewFilesId,
      });

      // 삭제된 이미지를 상태에서 제거
      setExistingImages((prevImages) =>
        prevImages.filter((image) => image.reviewFilesId !== reviewFilesId)
      );
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      alert('이미지 삭제에 실패했습니다.');
    }
  };

  // 폼 제출 처리 (수정된 리뷰와 파일 업로드)
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지

    try {
      const reviewData = {
        reviewTitle,
        reviewContent,
        reviewSatisfaction,
        reviewSize,
        reviewClean,
        reviewKindness,
      };

      // 리뷰 데이터 서버에 업데이트 요청
      await axios.post(
        `http://localhost:8080/review/${reviewId}/update`,
        reviewData
      );

      // 파일 업로드 처리 (파일이 있을 경우에만)
      if (files.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }

        // 파일을 해당 리뷰와 연결하여 업로드
        await axios.post(
          `http://localhost:8080/review/${reviewId}/image/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        alert('리뷰가 수정되었습니다.');
      } else {
        alert('리뷰가 수정되었습니다.');
      }

      navigate(`/review/${reviewId}`);
    } catch (err) {
      console.log(
        '[ReviewUpdate.js] Error during review update or file upload:',
        err
      );
      alert('리뷰 수정에 실패했습니다. 제목과 설문 항목을 확인해주세요');
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
                    onClick={() => navigate(`/review/${reviewId}`)}
                  >
                    수정 취소
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
                          value={new Date(resDate).toLocaleDateString()}
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
                <div className="content">
                  {/* 기존 이미지 미리보기 */}
                  {existingImages.length > 0 && (
                    <div className="image-preview">
                      {existingImages.map((image) => (
                        <img
                          key={image.reviewFilesId}
                          src={image.filePath} // 클라이언트에서 바로 접근할 수 있는 상대 경로
                          alt={image.originFileName}
                          style={{
                            maxWidth: '50%',
                            height: 'auto',
                            borderRadius: '10px',
                            display: 'block',
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <br />
                  <input
                    type="file"
                    multiple
                    accept=".jpg, .jpeg, .png, .svg, .heic, .webp"
                    className="input-txt input-max"
                    onChange={handleFileChange}
                  />
                  <br />
                  <ReactQuill
                    ref={quillRef}
                    value={reviewContent}
                    onChange={changeContent}
                    placeholder="내용을 입력해주세요"
                    theme="snow"
                    modules={modules}
                    style={{
                      height: '500px', // 높이를 300px로 설정
                    }}
                  />
                  <br />
                  <br />
                </div>
              </div>
              <div className="bar mt_lg mb_lg"></div>
              <div className="foot-area">
                <input
                  type="submit"
                  className="submit input-lg"
                  value="리뷰 수정"
                />
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ReviewUpdate;
