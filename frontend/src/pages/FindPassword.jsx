/**
 * Author : woo
 * Date : 24.05.01
 * Last : 24.05.12
 * Description : Find Password
 */
import React, { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {AuthContext} from '../context/AuthContext';

import axios from 'axios';
const serverUrl = process.env.REACT_APP_SERVER_URL;

const FindPassword = () => {
    const [inputEmail, setEmail] = useState("");
    const [inputPassword, setPassword] = useState(
        {
            firstPassword : "",
            secondPassword : ""
        }
    );
    const [emailState, setEmailState] = useState(false);
    const [sendState, setSendState] = useState(false);
    const handleChange = (e) => {
        if(e.target.name === 'inputEmail'){
            setEmail(e.target.value);
        }else{
            setPassword((prev) => ({...prev,[e.target.name] : e.target.value}));
        }
    };
    //이메일 확인
    const checkEmail = async() => {
        if (inputEmail.trim().length === 0) {
            alert("이메일(아이디)을 입력해주세요");
            return; // 입력값이 빈 문자열인 경우 함수 종료
        }
        console.log(inputEmail);
        const res = await axios.post(`${serverUrl}/findEmail`,{email : inputEmail});
        if(res.data.success){
            alert(`${res.data.message}`);
            setEmailState(true);
        }else{
            alert(`${res.data.message}`);
        }    
    }
    //인증코드 전송
    const sendCode = () => {
        if(emailState){
            setSendState(true);
            alert("인증 코드 전송");
        }else{
            alert("이메일확인 부터 진행 해야 합니다.");
        }
    }

    //인증 코드 확인

    //암호 일치 확인
    const updatePassword = () => {
        console.log(inputPassword.firstPassword);
        console.log(inputPassword.secondPassword);
        if(inputPassword.firstPassword === inputPassword.secondPassword){
            console.log("비밀번호 일치 변경 가능");
        }else{
            console.log("비밀번호가 일치 하지 않습니다.");
        }
    }

    return (
        <div className='auth'>
            <form>
                <label>이메일</label>
                <input type="text" placeholder='Email' name='inputEmail' value={inputEmail} onChange={handleChange}/>
                <button type='button' onClick={checkEmail}>Email 확인</button>
                
                <label>인증 코드 입력</label>
                <input type='text'/>
                {sendState ? <button type='button' onClick={sendCode}>코드 확인</button> : <button type='button' onClick={sendCode}>인증 코드 받기</button>}
                
                <label>새 비밀번호</label>
                <input type='password' placeholder='password' name='firstPassword' value={inputPassword.firstPassword} onChange={handleChange}/>
                <input type='password' placeholder='password' name='secondPassword' value={inputPassword.secondPassword} onChange={handleChange}/>
                { inputPassword.firstPassword === null || inputPassword.firstPassword === "" ? null : (inputPassword.firstPassword === inputPassword.secondPassword ? <h6 style={{color:'blue'}}> 비밀번호가 일치 합니다.</h6>
                : <h6 style={{color:'red'}}>비밀번호가 일치하지 않습니다.</h6>)}
                <button type='button' onClick={updatePassword}>비밀 번호 변경하기</button>
            </form>
        </div>
    );
}

export default FindPassword;