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


const Login = () => {
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
    
    return (
        <div className='auth'>
            <p>Login</p>
            <form onSubmit={handleSubmit}>
                <label>ID</label>
                <input type="text" placeholder='Email' name='userEmail' onChange={handleChange} />
                <label>Password</label>
                <input type="password" placeholder='password' name='userPassword' onChange={handleChange} onKeyDown={(e)=>handleKeyDown(e.key)}/>
                <button>Login</button>
                <button style={{ backgroundColor: 'yellow' , color:'black'}}><img className='kakao' src={kakao}/>로그인</button>
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