import "../../css/camp-list.css";
import "../../css/page.css"
import axios from "axios";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Pagination from "react-js-pagination";
import qs from "qs";
import CampLikeBtn from "./CampLikeBtn";

function CampList(){
    const [campList, setCampList] = useState([]);

    // Paging
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCnt, setTotalCnt] = useState(0);

    //search
    const [filters, setFilters] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilters, setSelectedFilters] = useState([]);
    const filterList = ["전기", "화장실", "장작 판매", "온수", "와이파이", "운동시설", "반려동물", "수영장"];

    const getCampList = async (page)=>{
        try {
            const response = await axios.get(`http://localhost:8080/camp`,{params: {"page": page - 1}});

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

    const campSearch = async (search, page) => {
        try {
            console.log("검색어:", searchTerm, "필터:", selectedFilters);
            const response = await axios.get(`http://localhost:8080/camp/search`, {
                params: {
                    search: searchTerm,
                    filters: selectedFilters,
                    page: page - 1,
                    sort: "id,desc",
                },
                paramsSerializer: (params) => qs.stringify(params, {arrayFormat:"repeat"}),
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

    useEffect(() => {
        getCampList(1);
    }, []);

    useEffect(() => {
        campSearch(searchTerm, page);
    }, [selectedFilters, searchTerm, page]);

    // 페이징 보여주기
    const changePage = (page) => {
        setPage(page);
        if (searchTerm || selectedFilters.length > 0) {
            campSearch(searchTerm, page);
        } else {
            getCampList(page);
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






    return(
        <>
            <main id="main" className="camp-list">
                <section className="sec">
                    <div className="inner_02">
                        <div className="serch_wrap">
                            <form id="search-form" onSubmit={(e) => {
                                e.preventDefault();
                                campSearch(searchTerm, page);
                            }}>
                                <div className="search-filter">
                                    <ul className="filter">
                                        {filterList.map(function (filter) {
                                            return (
                                                <li
                                                    className={selectedFilters.includes(filter) ? "item active" : "item"}
                                                    key={filter}
                                                    onClick={() => toggleFilter(filter)}
                                                >
                                                    #{filter}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <div className="search-area mt_md">
                                    <input type="text" className="search-input" placeholder="캠핑장 검색"
                                           value={searchTerm}
                                           onChange={changeSearch}/>
                                    <input type="submit" value="" className="search-btn"/>
                                </div>
                            </form>
                            <div className="bar mt_lg mb_xlg"></div>
                        </div>
                    </div>
                </section>
                <section className="sec">
                    <div className="inner_01">
                        <div className="camp_list_wrap">
                            <ul className="camp_list">
                                {campList.map(function (camp, idx) {
                                    return <CampItem obj={camp} key={idx} cnt={idx + 1}/>
                                })}
                            </ul>
                            {campList.length > 0 ? (
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
                            ) : null}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

function CampItem(props) {
    const camp = props.obj;
    const url = window.location.href + "/" + camp.id;
    const copyUrl = async (e) => {
        e.preventDefault();
        try {
            await navigator.clipboard.writeText(url);
            alert("URL이 복사되었습니다!");
        } catch (err) {
            console.error("복사 실패:", err);
        }
    };
    return (
        <li className="camp">
            <div className="wrap">
                <Link to={{pathname: `/camp/${camp.id}`}}>
                    <div className="title-area">
                        <h3 className="fs_lg mb_xsm">
                            {camp.campName}
                        </h3>
                    </div>
                    <div className="img-area">
                        {camp.thumb && Array.isArray(camp.thumb) && camp.thumb.length > 0 && camp.thumb[0]?.filePath
                            ? <img src={camp.thumb[0].filePath} alt="캠핑장 썸네일"/>
                            : <img src="/images/camp/sample_01.jpeg" alt="기본 썸네일"/>
                        }
                        <div className="btn-box">
                            <CampLikeBtn campId={camp.id}/>
                            <div id="share-btn" className="icon" onClick={copyUrl}>
                                <img src="/images/common/share.svg" alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className="txt-area">

                        <p className="fs_md">
                            📍 {camp.campAddressDo} {camp.campAddressGungu}
                        </p>
                        <p className="fs_md">
                            {camp.campInfo}
                        </p>
                    </div>
                </Link>
            </div>
        </li>
    );
}

export default CampList;