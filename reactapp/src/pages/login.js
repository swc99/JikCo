/**
 * 작성자 : 성우창
 * 작성일 : 24.01.12
 * 수정 : 24.01.14
 */

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [UserEmail, setUserEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ UserEmail, Password }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("로그인 성공!");
        console.log(data);
        setUserInfo(data.userInfo);
        // 로그인 성공 시 메인 페이지로 이동
        navigate("/home",{state: {userInfo: userInfo}});
      } else {
        console.error("로그인 실패");
      }
    } catch (error) {
      console.error("오류 발생", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label htmlFor="useremail">UserEmail:</label>
      <input
        type="text"
        id="useremail"
        name="useremail"
        required
        value={UserEmail}
        onChange={(e) => setUserEmail(e.target.value)}
      />

      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        required
        value={Password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
