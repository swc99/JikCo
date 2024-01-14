/**
 * 작성자 : 성우창
 * 작성일 : 24.01.12
 * 수정 : 24.01.14
 */

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Join = () => {
    return (
        <form>
        <h1>회원가입</h1>
        <label for="username">사용자 이름:</label>
        <input type="text" id="username" name="username" required/>

        <label for="email">이메일:</label>
        <input type="email" id="email" name="email" required/>

        <label for="password">비밀번호:</label>
        <input type="password" id="password" name="password" required/>

        <button type="submit">가입하기</button>
    </form>
    )
}

export default Join;