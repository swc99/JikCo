/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.17
 * Description : Login
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import kakao from '../img/kakao.png';
import Cookies from 'js-cookie'; // js-cookie 라이브러리 사용
const serverUrl = process.env.REACT_APP_SERVER_URL;

const Login = () => {
    const [userEmail, setEmail] = useState();
    const [userPassword, setPassword] = useState();
    const nav = useNavigate();

    const handlesubmit=()=>{
            fetch(`${serverUrl}/login`,{
                method: 'POST',
            headers: {
                'Content-Type': 'application/json', // 요청 데이터 타입 설정
            },
            credentials: 'include', // withCredentials 설정
            body: JSON.stringify({
                UserEmail : userEmail,
                Password : userPassword
            }),
            })
            .then((response) => response.json())
            .then((data)=>{
                if(data.success){
                   // Cookies.set('accesstoken', data.accesstoken);
                    nav('/');
                }else{
                    console.log('응답 실패');
                }
            });
    }

    

    
    return (
        <div className='auth'>
            <p>Login</p>
            <form>
                <label>ID</label>
                <input type="text" placeholder='Email' value={userEmail} onChange={(e) => setEmail(e.target.value)} />
                <label>Password</label>
                <input type="password" placeholder='password' value={userPassword} onChange={(e) => setPassword(e.target.value)}/>
                <button type="button" onClick={handlesubmit}>Login</button>
                <button style={{ backgroundColor: 'yellow' , color:'black'}}><img className='kakao' src={kakao}/>로그인</button>
                <p>This is an error!</p>
                <span> 아직 계정이 없다면?</span>
                <Link className='link' to={'/register'}>
                <a class="actionBtn1">
                    <span class="hover"></span>
                    <span>회원가입</span>
                </a>
                </Link>
               
            </form>
        </div>
    );
}

export default Login;
