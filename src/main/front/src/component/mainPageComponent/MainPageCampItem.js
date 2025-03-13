import {Link} from "react-router-dom";

function MainPageCampItem(props){
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
        <div className="item">
            <Link to={{pathname: `/camp/${camp.id}`}}>
                <div className="img-area">
                    {camp.thumb && Array.isArray(camp.thumb) && camp.thumb.length > 0 && camp.thumb[0]?.filePath
                        ? <img src={camp.thumb[0].filePath} alt="캠핑장 썸네일"/>
                        : <img src="/images/camp/sample_01.jpeg" alt="기본 썸네일"/>
                    }
                </div>
                <div className="txt-area">
                    <h3 className="fs_xlg mb_xsm tc-w">
                        {camp.campName}
                    </h3>
                    <p className="fs_lg tc-w">
                        📍 {camp.campAddressDo} {camp.campAddressGungu}
                    </p>
                </div>
            </Link>
        </div>
    );
}

export default MainPageCampItem;