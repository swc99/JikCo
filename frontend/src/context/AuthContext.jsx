import axios from "axios";
import { createContext, useEffect, useState } from "react";
const serverUrl = process.env.REACT_APP_SERVER_URL;


export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const login = async (inputs) => {
        const res = await axios.post(`${serverUrl}/login`, inputs);
        setCurrentUser(res.data);
    };

    const logout = async (inputs) => {
        await axios.post(`${serverUrl}/logout`);
        setCurrentUser(null);
    };

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

