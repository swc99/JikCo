/**
 * Author : woo
 * Date : 24.01.10
 * Last : 24.01.30
 * JikCo Server!
 */
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const user = require('./router/userRouter');
const lecture = require('./router/lectureRouter');
const api = require('./router/api')
const cors = require('cors');
const dotenv = require('dotenv');
const cookieparser = require('cookie-parser');
const path = require('path');

const corsOptions = {
    origin: 'http://localhost:3000', // 클라이언트의 주소로 변경
    credentials: true,
};
const app = express();
dotenv.config();

app.use(express.static('public'));

app.use(cors(corsOptions));
app.use(cookieparser());
app.use(bodyParser.json());

const port = 4000;

app.use('/api',api);// 메인페이지, 로그인&가입, 검색, 강의 시청
app.use('/api/userInfo',user);//사용자 정보 수정 및 조회, 결제 및 결제 내역
app.use('/api/lectureDetail',lecture);// 강의 상세 페이지, 리뷰 조회 및 작성

app.set('port',port);



app.listen(port, ()=>{
    console.log('JikCo Server is running...');
});

module.exports = app;