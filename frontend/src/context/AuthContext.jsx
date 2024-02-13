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
        if(res.data.success){
            setCurrentUser(res.data.userInfo);
        }else{
            alert('아이디/비밀번호를 확인해주세요');
            window.location.replace('/login');
        }
    };

    const logout = async () => {
        await axios.get(`${serverUrl}/logout`,{ withCredentials: true });
        setCurrentUser(null);
        window.Kakao.Auth.logout();
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

    const updateUserImage = async (formData) => {
        const res = await axios.post(`${serverUrl}/imageChange`, formData);
        if(res.data.success){
            setCurrentUser(res.data.UserInfo);
            console.log(res.data.message); // 성공 또는 실패에 따른 처리
            alert(res.data.message);
            window.location.reload();
        }else{
            alert(res.data.message);
            return;
        }
    }

    useEffect(() => {
            localStorage.setItem("UserInfo", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, checkTokenValidity, updateUserImage }}>
            {children}
        </AuthContext.Provider>
    );
};