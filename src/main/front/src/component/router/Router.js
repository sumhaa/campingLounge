import {Route, Routes} from "react-router-dom";
import Login from "../app/Login";
import SignIn from "../app/SignIn";
import MemberDetail from "../app/Member-detail";
import MemberUpdate from "../app/MemberUpdate";
import TossPayment from "../Payment/TossPayment";
import Fail from "../Payment/Fail";
import Success from "../Payment/Success";
import CampDetail from "../app/CampDetail";
import CampList from "../app/CampList";
import ReviewList from '../bbs/ReviewList';
import ReviewWrite from '../bbs/ReviewWrite';
import ReviewUpdate from '../bbs/ReviewUpdate';
import ReviewDetail from '../bbs/ReviewDetail';
import Weather from "../app/Weather";
import Admin from "../app/Admin";
import ChatList from "../app/ChatList";
import Chat from "../app/Chat";
import ChatListRoom from "../app/ChatListRoom";
import AdminSignIn from "../app/AdminSignIn";

import MainPage from "../app/MainPage";


function Router({setAdminMode, setMainPage, mainLayoutChange, setProfileChange}) {
    return (
        <Routes>
			<Route path={"/"} element={<MainPage setMainPage={setMainPage} mainLayoutChange={mainLayoutChange}/>} />
            {/*멤버*/}
            <Route path={"/login"} element={<Login/>} />
            <Route path={"/signIn"} element={<SignIn/>}/>
            <Route path={`/memberDetail/:memberId`} element={<MemberDetail/>}/>
            <Route path={"/update"} element={<MemberUpdate setProfileChange={setProfileChange} />}/>
            {/*캠프*/}
            <Route path="/camp" element={<CampList />}/>
            <Route path="/camp/:campId" element={<CampDetail />}/>
            <Route path={"/pay"} element={<TossPayment/>}/>
            <Route path={"/fail"} element={<Fail/>}/>
            <Route path={"/success"} element={<Success/>}/>
            {/*리뷰*/}
            <Route path="/review/list" element={<ReviewList />} />
            <Route path="/review/write" element={<ReviewWrite />} />
            <Route path="/review/:reviewId" element={<ReviewDetail />} />
            <Route path="/review/:reviewId/update" element={<ReviewUpdate />} />
            {/*날씨*/}
            <Route path="/weather" element={<Weather />} />
            {/*관리자*/}
            <Route path={"/signInAdmin"} element={<AdminSignIn/>}/>
            <Route path="/admin" element={<Admin setAdminMode={setAdminMode}/> } />
            {/*채팅*/}
            <Route path={"/chat"} element={<Chat />}></Route>
            <Route path={"/chatList"} element={<ChatListRoom />}></Route>
        </Routes>
    );
}

export default Router;