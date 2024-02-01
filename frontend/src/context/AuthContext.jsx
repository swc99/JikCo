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

    useEffect(() => {
            localStorage.setItem("UserInfo", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};