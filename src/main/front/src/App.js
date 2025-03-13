import { BrowserRouter } from "react-router-dom";

// css
import "./css/reset.css";
import "./css/common.css";

import Header from "./component/layout/Header";
import Footer from "./component/layout/Footer";
import Main from "./component/app/Main";
import AuthProvider, {AuthContext} from "./component/context/AuthProvider";
import HttpHeadersProvider from "./component/context/HttpHeadersProvider";
import ScrollTopBtn from "./component/app/ScrollTopBtn";
import {useContext, useEffect, useState} from "react";
import AutoScrollTop from "./component/layout/AutoScrollTop";

function App() {
    const [mainPage, setMainPage] = useState(false);
    const [adminMode, setAdminMode] = useState(false);
    const [mainLayoutChange, setMainLayoutChange] = useState(false);
    const [profileChange, setProfileChange] = useState(false);



  return (
    <div className="App">
        <BrowserRouter>
            <AuthProvider>
                <HttpHeadersProvider>
                  <Header adminMode={adminMode} mainPage={mainPage} setMainLayoutChange={setMainLayoutChange}  profileChange={profileChange} setProfileChange={setProfileChange}/>
                    <ScrollTopBtn />
                       <AutoScrollTop>
                        <Main setAdminMode={setAdminMode} setMainPage={setMainPage} mainLayoutChange={mainLayoutChange} setProfileChange={setProfileChange}/>
                       </AutoScrollTop>
                  <Footer />
                </HttpHeadersProvider>
            </AuthProvider>
        </BrowserRouter>
    </div>
  );
}

export default App;
