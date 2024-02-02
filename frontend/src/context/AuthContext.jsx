/**
 * Update : woo
 * Date : 24.01.15
 * Last : 24.02.02
 * Description : 
 */
import axios from "axios";
import { createContext, useEffect, useState } from "react";

const serverUrl = process.env.REACT_APP_SERVER_URL;


export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("UserInfo")) || null
    );

    const login = async (inputs) => {
        const res = await axios.post(`${serverUrl}/login`, inputs,{ withCredentials: true });
        setCurrentUser(res.data.userInfo);
    };

    const logout = async () => {
        await axios.get(`${serverUrl}/logout`,{ withCredentials: true });
        setCurrentUser(null);
    };

    const checkTokenValidity = async () => {
        try {
            const res = await axios.get(`${serverUrl}/checkToken`, {
              withCredentials: true,
            });
            return res.data.success; // 서버 응답에 따라 조정
          } catch (error) {
            console.error("토큰 유효성 확인 오류:", error);
            return false;
          }
    }

    useEffect(() => {
            localStorage.setItem("UserInfo", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, checkTokenValidity }}>
            {children}
        </AuthContext.Provider>
    );
};