/**
 * 작성자 : 성우창
 * 작성일 : 24.01.10
 * 수정 날짜 : 24.01.13
 * JikCo Server!
 */
const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./DB/DBconn');
const user = require('./router/userRouter');
const lecture = require('./router/lectureRouter');
const api = require('./router/api')
const cors = require('cors');

const app = express();
app.use(cors());
const port = 4000;

// app.use(express.static(path.join(__dirname,'reactapp/build/index.html')));
app.use('/api',api);// 메인페이지, 로그인&가입, 검색, 강의 시청
app.use('/api/userInfo',user);//사용자 정보 수정 및 조회, 결제 및 결제 내역
app.use('/api/lectureDetail',lecture);// 강의 상세 페이지, 리뷰 조회 및 작성

app.use(bodyParser.json());
app.set('port',port);



app.listen(port, ()=>{
    console.log('JikCo Server is running...');
});

module.exports = app;