/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.17
 * Description : Login
 */
import React from 'react';
import { Link } from 'react-router-dom';
import kakao from '../img/kakao.png';

const Login = () => {

    
    return (
        <div className='auth'>
            <p>Login</p>
            <form>
                <label>ID</label>
                <input type="text" placeholder='Email' />
                <label>Password</label>
                <input type="password" placeholder='password' />
                <button><Link className='link' to={'/'}>Login</Link></button>
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
