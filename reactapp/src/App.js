/**
 * 작성자 : 성우창
 * 작성일 : 24.01.12
 * 수정 : 24.01.14
 */

import Home from "./pages/Home";
import React from "react";
import {Routes, Route, Link} from 'react-router-dom';
import About from "./pages/About";
import Join from "./pages/Join";
import Login from "./pages/login";

function App() {
  return (
    <div className='APP'>
      <nav>
        <Link to="/home">Home</Link> | <Link to="/about">Category</Link> | <Link to="/join">회원 가입</Link> | <Link to="/login">로그인</Link>
      </nav>
      <Routes>
        <Route path="/home" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/join" element={<Join/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </div>
  );
}

export default App;
