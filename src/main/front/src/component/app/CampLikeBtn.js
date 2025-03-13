import {useState} from "react";
import axios from "axios";

function CampLikeBtn({campId}){
    const [isActive, setIsActive] = useState(false);

    const handlerActive = () =>{
        setIsActive((prev)=>!prev);
        console.log(isActive);
    }

    const upLikeCount = async ()=>{
        try {
            await axios.get(`http://localhost:8080/camp/uplike`,{params:{campId: campId}});
            console.log("[CampLikeBtn] upLikeCount success.")
        }
        catch (error){
            console.log("[CampLikeBtn] upLikeCount error.")
            console.error(error);
        }
    }
    const downLikeCount = async ()=>{
        try {
            await axios.get(`http://localhost:8080/camp/downlike`,{params:{campId:campId}});
            console.log("[CampLikeBtn] downLikeCount success.")
        }
        catch (error){
            console.log("[CampLikeBtn] downLikeCount error.")
            console.error(error);
        }
    }

    return (
        <div id="like-btn" className={isActive ? "icon active" : "icon"}
            onClick={(e)=>{
                e.preventDefault();
                handlerActive()
                {isActive ? downLikeCount() : upLikeCount()}
            }}
        >
            <img src="/images/common/heart.svg" alt=""/>
        </div>
    );
}

export default CampLikeBtn;