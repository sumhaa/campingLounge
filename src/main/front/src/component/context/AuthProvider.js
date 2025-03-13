import { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
//auth : 현재 로그인한 사용자의 인증 상태를 관리하는 변수(로그인 여부 확인 가능 > 인증 상태에 따라 로그인 / 로그아웃 버튼 변경 가능)
	const [auth, setAuth] = useState(localStorage.getItem("id"));

	const value = {auth, setAuth };

	return (
		<AuthContext.Provider value = {value}>
			{children}
		</AuthContext.Provider>
	);

}

export default AuthProvider;