import { useContext, useEffect, useState } from 'react';
import { HttpHeadersContext } from '../context/HttpHeadersProvider';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';

function ReservationArea() {
  const { headers, setHeaders } = useContext(HttpHeadersContext);
  const [reservations, setReservations] = useState([]);
  const [refresh, setRefresh] = useState(false); // 리렌더링을 위한 상태 추가

  const { memberId } = useParams();
  const { campId, setCampId } = useState();
  const { reservationId, setReservationId } = useState();

  const reservationCancel = async (reservationId) => {
    try {
      await axios.delete(
        `http://localhost:8080/member/${memberId}/reservation/delete/${reservationId}`,
        { headers: headers }
      );
      setRefresh((prev) => !prev);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/member/${memberId}/reservation`, {
        headers: headers,
      })
      .then((response) => {
        setReservations(response.data.content);
      })
      .catch((error) => {
        console.error('예약 정보를 가져오는 중 오류 발생:', error);
      });
  }, [refresh]);

  // 상태 관리: 현재 페이지와 한 페이지당 표시할 항목 수
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // 한 페이지에 보여줄 개수

  // 총 페이지 수 계산
  const totalPages = Math.ceil(reservations.length / itemsPerPage);

  // 현재 페이지에 해당하는 데이터 추출
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = reservations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // 페이지 변경 함수
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="item-area pt_xlg">
      <h3 className="fs_xlg mb_sm">예약 내역</h3>
      <div className="bar mb_lg"></div>

      {reservations.length === 0 ? (
        <div className="empty">
          <p className="fs_xlg mb_lg">예약이 없습니다</p>
        </div>
      ) : (
        <div className="res_wrap">
          <table className="member-detail-table">
            <thead>
              <tr>
                <th>캠핑장</th>
                <th>예약 확정일</th>
                <th>방문일</th>
                <th>후기</th>
                <th>취소</th>
              </tr>
            </thead>
            <tbody>
              {currentReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.campName}</td>
                  <td>
                    {new Date(reservation.reservationDate).toLocaleDateString()}
                  </td>
                  <td>
                    {new Date(reservation.usageDate).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className={`btn btn-${
                        reservation.hasReview ? 's' : 'p'
                      }-f btn-xsm mlr-a`}
                    >
                      <Link
                        to={`/review/write`}
                        state={{
                          memberId: reservation.memberId,
                          campId: reservation.campId,
                          reservationId: reservation.id,
                          reservationDate: reservation.reservationDate,
                        }}
                      >
                        {reservation.hasReview ? '후기 보기' : '후기 작성'}
                      </Link>
                    </button>
                  </td>

                  <td>
                    {new Date(reservation.usageDate) > new Date() ? (
                      <button
                        className={`btn btn-e-l btn-xsm mlr-a`}
                        onClick={() => reservationCancel(reservation.id)}
                      >
                        예약 취소
                      </button>
                    ) : (
                      <button
                        className={`btn btn-e-f btn-xsm mlr-a`}
                        style={{ cursor: 'default' }}
                      >
                        취소 불가
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* 페이지네이션 버튼 */}
          <div className="paging mt_md">
            <button
              className="fs_md"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            <p className="fs_md">
              &nbsp;&nbsp; {currentPage} / {totalPages} &nbsp;&nbsp;
            </p>
            <button
              className="fs_md"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservationArea;
