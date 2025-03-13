import Router from "../router/Router";


function Main({setAdminMode ,setMainPage, mainLayoutChange, setProfileChange}) {

    return(
        <>
            <Router
                setAdminMode={setAdminMode}
                setMainPage={setMainPage}
                mainLayoutChange={mainLayoutChange}
                setProfileChange={setProfileChange}
            />
        </>
    );
}

export default Main;