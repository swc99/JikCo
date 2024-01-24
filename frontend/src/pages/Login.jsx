/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.17
 * Description : Login
 */
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import kakao from '../img/kakao.png';
import {AuthContext} from '../context/AuthContext';
import { useCookies } from "react-cookie";


const Login = () => {
    const [inputs, setInputs] = useState({
        userEmail: "",
        userPassword: "",
    });
    const [cookies, setCookie] = useCookies(['accesstoken']);
    const [err, setError] = useState(null);

    const nav = useNavigate();
    const { login } = useContext(AuthContext);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(inputs);
            // setCookie('accesstoken', token, { path: '/' });
            console.log(inputs);
            nav("/");
        } catch (err) {
            // 에러 객체를 확인하여 어떤 속성이 있는지 로그에 출력
            console.error(err);
            // err 객체가 response 속성을 가지고 있는지 확인
            if (err.response) {
                // response 속성이 있을 경우, data 속성이 있는지 확인
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

    

    
    return (
        <div className='auth'>
            <p>Login</p>
            <form>
                <label>ID</label>
                <input type="text" placeholder='Email' name='userEmail' onChange={handleChange} />
                <label>Password</label>
                <input type="password" placeholder='password' name='userPassword' onChange={handleChange}/>
                <button type="button" onClick={handleSubmit}>Login</button>
                <button style={{ backgroundColor: 'yellow' , color:'black'}}><img className='kakao' src={kakao}/>로그인</button>
                <p>This is an error!</p>
                <span> 아직 계정이 없다면?</span>
                <Link className='link' to={'/register'}>
                <button className="actionBtn1">
                    <span className="hover"></span>
                    <span>회원가입</span>
                </button>
                </Link>
               
            </form>
        </div>
    );
}

export default Login;
