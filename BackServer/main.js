/**
 * Author : woo
 * Date : 24.01.10
 * Last : 24.01.30
 * JikCo Server!
 */
const http = require('http');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const user = require('./router/userRouter');
const lecture = require('./router/lectureRouter');
const api = require('./router/api')
const cors = require('cors');
const dotenv = require('dotenv');
const cookieparser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const corsOptions = {
    origin: ['https://localhost:3000','https://localhost','http://localhost','http://localhost:3000'],
    credentials: true,
};
const httpsOptions = {
    key: fs.readFileSync('../key.pem'),
    cert: fs.readFileSync('../cert.pem')
}
const app = express();
dotenv.config();

app.use(express.static('public'));

app.use(cors(corsOptions));
// app.use(cors());
app.use(cookieparser());
app.use(bodyParser.json());

const httpPort = 4000;
const httpsPort = 5000;

app.use('/api',api);// 메인페이지, 로그인&가입, 검색, 강의 시청
app.use('/api/userInfo',user);//사용자 정보 수정 및 조회, 결제 및 결제 내역
app.use('/api/lectureDetail',lecture);// 강의 상세 페이지, 리뷰 조회 및 작성

app.set('port',httpPort);



// app.listen(httpPort, ()=>{
//     console.log('JikCo Server is running...');
// });

http.createServer(app).listen(httpPort,()=>{
    console.log('JikCo Server is running on http...');
});

https.createServer(httpsOptions,app).listen(httpsPort,()=>{
    console.log('JikCo Server is running on https...');
});

module.exports = app;