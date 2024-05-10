/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.17
 * Description : Login
 */
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
// import KakaoLogin from '../components/KakaoLogin';
import KakaoLogin from 'react-kakao-login';
import axios from 'axios';

const Client_Key = process.env.REACT_APP_CLIENT_KEY;
const serverUrl = process.env.REACT_APP_SERVER_URL;

const Login = () => {
    const kakaoClientId = Client_Key;
    const [inputs, setInputs] = useState({
        userEmail: "",
        userPassword: "",
    });
    const [err, setError] = useState(null);

    const nav = useNavigate();
    const { login } = useContext(AuthContext);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(inputs);
            console.log(inputs);
            nav("/");
        } catch (err) {
            console.error(err);
            if (err.response) {
                if (err.response.data) {
                    setError(err.response.data);
                } else {
                    setError("에러: 응답 데이터 없음");
                }
            } else {
                setError("에러: 응답 없음");
            }
        }
    };
    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const kakaoOnSuccess = async (data) => {
        console.log('카카오로그인',data);
        const idToken = data.response.access_token;
        console.log("idToken", idToken)
        if (idToken) {
            try {
                const response = await axios.post(
                    `${serverUrl}/kakaoCallback`,
                    {
                        idToken,
                    },
                    {
                        withCredentials: true,
                    }
                );
                console.log("response.data12: ", response.data);
                await login({
                    userEmail:response.data.UserEmail, 
                    userPassword:response.data.Password
                });
                nav('/');
                    
            } catch (error) {
                console.log("error: ", error);
            }
        }
      };
      const kakaoOnFailure = (error) => {
        window.location.href='http://localhost:3000';
      };

    
    return (
        <div className='auth'>
            <p>Login</p>
            <form onSubmit={handleSubmit}>
                <label>ID</label>
                <input type="text" placeholder='Email' name='userEmail' onChange={handleChange} />
                <label>Password</label>
                <input type="password" placeholder='password' name='userPassword' onChange={handleChange} onKeyDown={(e)=>handleKeyDown(e.key)}/>
                <button style={{borderRadius: '5px'}}>Login</button>
                <KakaoLogin
                    type='button'
                    token={kakaoClientId}
                    onSuccess={kakaoOnSuccess}
                    onFail={kakaoOnFailure}
                    style={{
                    padding: "10px",
                    backgroundColor: "#FAE100",
                    color: "black",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    }}
                />

                <span> 아직 계정이 없다면?</span>
                <Link className='link' to={'/register'}>
                <button className="actionBtn1">
                    <span className="hover"></span>
                    <span>회원가입</span>
                </button>
                </Link>
                <Link className='link' to={'/findPassword'}
                style={{marginLeft:'auto',marginRight:'auto'}}>
                        <span>아이디/비밀번호 찾기</span>
                </Link>
            </form>
        </div>
    );
}

export default Login;