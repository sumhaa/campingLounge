import Pagination from "react-js-pagination";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import qs from "qs";
import {HttpHeadersContext} from "../context/HttpHeadersProvider";
import AdminCampCount from "./AdminCampCount";
import AdminCampNew from "./AdminCampNew";
import AdminCampGetApi from "./AdminCampGetApi";
import AdminCampUpdate from "./AdminCampUpdate";

function AdminCampBoard(){
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCnt, setTotalCnt] = useState(0);
    const [ sort,setSort ] = useState("id");
    const [ direction,setDirection ] = useState(",desc");

    const [campList, setCampList] = useState([]);

    //search
    const [filters, setFilters] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilters, setSelectedFilters] = useState([]);
    const filterList = ["전기", "화장실", "장작 판매", "온수", "와이파이", "운동시설", "반려동물", "수영장"];

    const [selectAll, setSelectAll] = useState(false);
    const [selectedCamps, setSelectedCamps] = useState([]);

    const [updateOpen, setUpdateOpen] = useState(false);
    const [writeOpen, setWriteOpen] = useState(false);

    const [selectCampId, setSelectCampId] = useState(1);

    const token = localStorage.getItem("CL_access_token");
    const { headers, setHeaders } = useContext(HttpHeadersContext);

    const getCampList = async (page,sort,direction)=>{
        try {
            const response = await axios.get(`http://localhost:8080/camp`,{
                params: {
                    "page": page - 1,
                    "sort": sort + direction,
                    "size" : 15
                },
                headers: headers
            });

            console.log("[CampList.js] getCampList() success.");
            console.log(response.data);

            setCampList(response.data.content);
            setPageSize(response.data.pageSize);
            setTotalCnt(response.data.totalElements);

        }catch (error){
            console.log("[CampList.js] getCampList() error.");
            console.log(error);
        }
    }

    const campSearch = async (search, page,sort,direction) => {
        try {
            console.log("검색어:", searchTerm, "필터:", selectedFilters);
            const response = await axios.get(`http://localhost:8080/camp/search`, {
                params: {
                    search: searchTerm,
                    filters: selectedFilters,
                    page: page - 1,
                    sort: sort + direction,
                },
                paramsSerializer: (params) => qs.stringify(params, {arrayFormat:"repeat"}),
                headers: headers
            });

            console.log("[CampList.js] campSearch() success.");
            console.log(response.data);

            setCampList(response.data.content);
            setTotalCnt(response.data.totalElements);  // 수정된 부분

        } catch (error) {
            console.log("[CampList.js] campSearch() error.");
            console.log(error.response?.data);
            console.log(error);
        }
    };

    const deleteCamp = async (campId) => {
        if (window.confirm("캠프를 삭제하시겠습니까?")) {
            await axios.delete(`http://localhost:8080/admin/camp/${campId}/delete`, {headers: headers})
                .then(() => {
                    alert("캠프가 삭제되었습니다.");
                    getCampList(page, sort, direction);
                })
                .catch(error => {
                    console.error("캠프 삭제 중 오류 발생 : ", error);
                });
        }
    }

    useEffect(() => {
        setHeaders({ "Authorization": `Bearer ${token}` });
    }, []);

    useEffect(() => {
        getCampList(1,sort,direction);
    }, [sort,direction]);

    useEffect(() => {
        campSearch(searchTerm, page,sort,direction);
    }, [selectedFilters, searchTerm, page]);

    // 페이징 보여주기
    const changePage = (page) => {
        setPage(page);
        setSelectedCamps([]);
        setSelectAll(!selectAll);
        if (searchTerm || selectedFilters.length > 0) {
            campSearch(searchTerm, page);
        } else {
            getCampList(page,sort,direction);
        }
    };

    const changeSearch = (e) => setSearchTerm(e.target.value);

    const toggleFilter = (filter) => {
        setSelectedFilters((prevFilters) => {
            const newFilters = prevFilters.includes(filter)
                ? prevFilters.filter((f) => f !== filter) // 선택 해제
                : [...prevFilters, filter]; // 추가 선택

            setPage(1);
            return newFilters;
        });
    };

    const changeSort= (param)=>{
        setSort(param)
    }
    const changeDirection= (param)=>{
        setDirection(param)
    }

    const handleSelectCamp = (campId) => {
        setSelectedCamps(prevSelected =>
            prevSelected.includes(campId)
                ? prevSelected.filter(id => id !== campId)
                : [...prevSelected, campId]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedCamps([]);
        } else {
            setSelectedCamps(campList.map(camp => camp.id));
        }
        setSelectAll(!selectAll);
    };

    const handleBulkDelete = async () => {
        if (selectedCamps.length === 0) {
            alert("삭제할 캠프를 선택해주세요.");
            return;
        }
        if (window.confirm("선택한 캠프를 삭제하시겠습니까?")) {
            await Promise.all(selectedCamps.map(campId => axios.delete(`http://localhost:8080/admin/camp/${campId}/delete`, {headers: headers})))
                .then(() => {
                    alert("선택한 캠프가 삭제되었습니다.");
                    getCampList(page,sort,direction);
                })
                .catch(error => {
                    console.error("일괄 삭제 중 오류 발생 : ", error);
                });
        }
    };

    const selectFilter = (filter)=>{
        changeSort("id");
        changeDirection(",desc");
        toggleFilter(filter);
    }

    return (
        <>
            <section id="campboard" className="component">
                <div className="inner_02">
                    <div className="item">
                        <h3 className="fs_xlg">캠핑장 관리</h3>
                        <ul className="dashboard_list mb_lg">
                            <li>
                                <AdminCampCount/>
                            </li>
                            <li>
                                <div className="icon"><img src="/images/common/icon_write.svg" alt=""/>
                                </div>
                                <p className="fs_lg mt_md mb_md">캠핑장 등록</p>
                                <button className="btn" onClick={
                                    (e)=>{
                                      e.preventDefault();
                                      setWriteOpen(true);
                                    }
                                }>신규 등록</button>
                            </li>
                            <li>
                                <AdminCampGetApi/>
                            </li>
                        </ul>

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
                            <button className={sort === "id" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                                    onClick={() => changeSort("id")}>번호 순
                            </button>
                            <button className={sort === "campName" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                                    onClick={() => changeSort("campName")}>이름 순
                            </button>
                            <button className={sort === "campAddressDo" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                                    onClick={() => changeSort("campAddressDo")}>지명 순
                            </button>
                            <button className={sort === "campHit" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                                    onClick={() => changeSort("campHit")}>조회수 순
                            </button>
                            <button className={sort === "campLike" ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                                    onClick={() => changeSort("campLike")}>좋아요 순
                            </button>
                            {filterList.map(function (filter) {
                                return (
                                    <button
                                        className={selectedFilters.includes(filter) ? "btn btn-xsm btn-p-f" : "btn btn-xsm btn-p-l"}
                                        key={filter}
                                        onClick={() => selectFilter(filter)}
                                    >
                                        {filter}
                                    </button>
                                );
                            })}
                        </div>
                        <form className="dashboard-form">
                            <table>
                                <colgroup>
                                    <col/><col/><col/><col width={30 + `%`}/><col/><col/><col/><col/><col/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <td><input type="checkbox" className="check-all" checked={selectAll}
                                               onChange={handleSelectAll}/></td>
                                    <td>순번</td>
                                    <td>썸네일</td>
                                    <td>이름</td>
                                    <td>위치</td>
                                    <td>조회수</td>
                                    <td>좋아요</td>
                                    <td>수정</td>
                                    <td>삭제</td>
                                </tr>
                                </thead>
                                <tbody>
                                {campList.map(camp => (
                                    <tr key={camp.id}>
                                        <>
                                            <>
                                                <td><input type="checkbox" className="checkbox"
                                                           checked={selectedCamps.includes(camp.id)}
                                                           onChange={() => handleSelectCamp(camp.id)}/></td>
                                                <td>{camp.id}</td>
                                                <td>
                                                    {camp.thumb && Array.isArray(camp.thumb) && camp.thumb.length > 0 && camp.thumb[0]?.filePath
                                                        ? <img src={camp.thumb[0].filePath} alt="캠핑장 썸네일"/>
                                                        : <img src="/images/camp/sample_01.jpeg" alt="기본 썸네일"/>
                                                    }
                                                </td>
                                                <td>{camp.campName}</td>
                                                <td>{camp.campAddressDo} {camp.campAddressGungu}</td>
                                                <td>{camp.campHit}</td>
                                                <td>{camp.campLike}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-p-f btn-xsm"
                                                        onClick={(e)=>{
                                                            e.preventDefault()
                                                            setUpdateOpen(true)
                                                            setSelectCampId(camp.id);
                                                        }}
                                                    >
                                                        수정
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-e-l btn-xsm"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            deleteCamp(camp.id);
                                                        }}
                                                    >
                                                        삭제
                                                    </button>
                                                </td>
                                            </>
                                        </>
                                    </tr>
                                ))}
                                </tbody>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td colSpan={4}>
                                        <div className="search-area">
                                            <input type="text" className="search-input" placeholder="캠핑장 검색"
                                                   value={searchTerm}
                                                   onChange={changeSearch}/>
                                        </div>
                                    </td>
                                    <td></td>
                                    <td>
                                        <button type="btn btn-e-l btn-xsm" className="btn btn-e-l btn-xsm"
                                                onClick={(e)=> {
                                                    e.preventDefault();
                                                    handleBulkDelete();
                                                }}>
                                            선택 삭제
                                        </button>
                                    </td>
                                </tr>
                            </table>

                            <div className="bar"></div>
                            <div>
                                <div className="item-box mt_md">
                                    <Pagination
                                        className="pagination"
                                        activePage={page}
                                        itemsCountPerPage={pageSize}
                                        totalItemsCount={totalCnt}
                                        pageRangeDisplayed={5}
                                        prevPageText={"‹"}
                                        nextPageText={"›"}
                                        onChange={changePage}
                                    />

                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <AdminCampUpdate isOpen={updateOpen} onClose={() => setUpdateOpen(false)} campId = {selectCampId}/>
            <AdminCampNew isOpen={writeOpen} onClose={() => setWriteOpen(false)} />
        </>
    );
}
export default AdminCampBoard;