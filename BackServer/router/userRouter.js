/**
 * Author : woo
 * Date : 24.01.12
 * Last : 24.01.26
 * Endpoint : /api/userInfo
 * Description : 
 */

const db = require('../DB/DBconn');
const router = require('express').Router();
const bodyParser = require('body-parser');
const Jimp = require('jimp');
const path = require('path');
const iconv = require('iconv-lite');
const fs = require('fs'); // fs 모듈 추가
const { createCanvas, loadImage, registerFont } = require('canvas');
router.use(bodyParser.json());

//유저 정보 조회
router.get('/',(req,res)=>{
    const sql = `SELECT U.*, C1.CATEGORYNAME AS CNAME1, C2.CATEGORYNAME AS CNAME2,C3.CATEGORYNAME AS CNAME3 FROM USER U
    JOIN CATEGORY C1 ON C1.CATEGORYID = U.CATEGORYID1 JOIN CATEGORY C2 ON C2.CATEGORYID = U.CATEGORYID2
    JOIN CATEGORY C3 ON C3.CATEGORYID = U.CATEGORYID3 WHERE U.USERID =?;`;
    const values = [req.query.userId];

    db.query(sql,values,(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        console.log(result);
        if(result.length === 0){
            res.json({
                success : false,
                message : "유저 정보 조회 실패",
            });
        }else{
            res.json({
                success : true,
                message : "유저 정보 조회 성공",
                UserInfo : result
            });
        }
    });
});
//유저 정보 수정
router.post('/user_update',(req,res)=>{
    const userName = req.body.UserName;
    const userPhone = req.body.UserPhone;
    const categoryId1 = req.body.CategoryID1;
    const categoryId2 = req.body.CategoryID2;
    const categoryId3 = req.body.CategoryID3;
    const userId = req.body.UserID;

    const sql = `UPDATE USER SET USERNAME = ?,UserPhone = ?,CATEGORYID1 = ?,CATEGORYID2 =?,CATEGORYID3 =? WHERE USERID = ?;`;
    const values = [userName,userPhone,categoryId1,categoryId2,categoryId3,userId];

    db.query(sql,values,(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        console.log(result);
        if (result.affectedRows > 0) {
            res.json({
                success: true,
                message: "수정 완료"
            });
        } else {
            res.json({
                success: false,
                message: "해당 사용자를 찾을 수 없습니다."
            });
        }
    });
});
//수강 내역
router.get('/study_lecture',(req,res)=>{
    const sql = `SELECT L.LectureID ,L.TITLE, L.LectureImage , E.PaymentStatus , E.AttendanceRate, I.INSTRUCTORNAME 
    FROM LECTURES L JOIN ENROLLMENTS E ON L.LECTUREID = E.LECTUREID 
    JOIN INSTRUCTOR I ON I.INSTRUCTORID = L.INSTRUCTORID
    WHERE E.USERID = ? AND E.PaymentStatus IS TRUE ;`;
    const values = [req.query.UserID];
    console.log(values);

    db.query(sql,values,(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if(result.length > 0){
            res.json({
                success : true,
                message : "응답 성공",
                study : result
            });
            
        }else{
            res.json({
                success: false,
                message: '데이터가 없습니다'
            })
        }
    });
});
//찜 목록
router.get('/nonstudy_lecture',(req,res)=>{
    const sql = `SELECT L.LectureID ,L.TITLE,L.LECTUREPAY ,L.BOOK ,L.LECTUREIMAGE ,E.PaymentStatus FROM LECTURES L 
    JOIN ENROLLMENTS E ON L.LECTUREID = E.LECTUREID WHERE E.USERID = ? AND E.PaymentStatus IS FALSE  ;`;
    const values = [req.query.UserID];
    console.log(values);


    db.query(sql,values,(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if(result.length === 0){
            res.json({
                success: false,
                message: '데이터가 없습니다'
            })
        }else{
            res.json({
                success : true,
                message : "응답 성공",
                nonStudy : result
            });
        }
    });
});

//결제
router.post('/payment',(req,res)=>{
    console.log('결제 요청 정보 : ',req.body);
    const lectureId = req.body.LectureID;
    const userId = req.body.UserID;
    const pay = req.body.Pay;
    const address = req.body.Address;
    const name = req.body.Name;
    const email = req.body.Email;
    let hasbook = '';
    if(req.body.HasBook){
        hasbook = '1';
    }else{
        hasbook = '0';
    }
    const sql = `
    INSERT INTO PAYMENTS (LectureID,USERID,PAYMENTDATE,PAY,ADDRESS,NAME,EMAIL,BOOK) VALUE (?,?,NOW(),?,?,?,?,?);`;
    const values = [lectureId,userId,pay,address,name,email,hasbook];

    db.query(sql,values ,(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        const sql = `UPDATE ENROLLMENTS SET PAYMENTSTATUS = TRUE WHERE USERID = ? AND LECTUREID = ?;`;
        const values = [userId,lectureId];

        db.query(sql,values,(err,stupdate)=>{
            if(err){
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.json({
                success: true,
                message: '구매 성공'
            })
        });
    });
});
//결제 내역
router.post('/payment_list',(req,res)=>{
    const userId = req.body.UserID;

    const sql = `SELECT P.PAY, P.PAYMENTDATE , L.TITLE, L.LECTUREIMAGE,L.LECTUREPAY ,L.BOOK AS B_PAY,P.BOOK FROM PAYMENTS P
    JOIN LECTURES L ON L.LECTUREID = P.LECTUREID WHERE P.USERID = ?;`;
    const values = [userId];

    db.query(sql,values,(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        console.log(result);
        if(result.length === 0){
            res.send({
                success : false,
                message : "응답 실패",
            });
        }else{
            res.send({
                success : true,
                message : "응답 성공",
                paymentList : result
            });
        }
        
    });
});
router.post('/certificates', async (req, res) => {
    const userId = req.body.UserID;
    const userName = req.body.UserName;
    const lectureId = req.body.LectureID;
    const lectureTitle = req.body.LectureTitle;
    const INSTRUCTORNAME = req.body.INSTRUCTORNAME;
    console.log('수료증 발급 요청 : ', req.body);
    console.log('userName : ', userName);

    // 이미 발급되었는지 확인
    const existingCertificate = await checkExistingCertificate(userId, lectureId);
    if (existingCertificate) {
        console.log('이미 발급됨');
        return res.json({
            success: false,
            message: '이미 발급된 강의입니다.'
        });
    }

    // 캔버스 생성
    const canvas = createCanvas(800, 1000);
    const ctx = canvas.getContext('2d');

    // 배경 이미지 로드 및 캔버스에 그리기
    const backgroundImage = await loadImage('public/images/certificate.png');
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // 폰트 및 텍스트 스타일 설정
    const fontPath = 'public/font/tvNEnjoystoriesLight.ttf';
    console.log('폰트 위치',fontPath);
    registerFont(path.resolve(__dirname, '../' ,fontPath), { family: 'tvN 즐거운이야기 Light' }); // 글꼴 이름 이랑 같아야하는거 같음
    ctx.font = '36px "tvN 즐거운이야기 Light"'; // 폰트 크기 및 종류 설정
    ctx.fillStyle = '#000'; // 텍스트 색상 설정
    ctx.textAlign = 'center'; // 텍스트 가운데 정렬

    // 텍스트 그리기
    ctx.fillText(lectureTitle, canvas.width / 2, 670);
    ctx.fillText(INSTRUCTORNAME, 600, 770);

    ctx.font = '48px "tvN 즐거운이야기 Light"'; // 폰트 크기 및 종류 설정
    ctx.fillText(userName, canvas.width / 2, 510);

    // 이미지 저장
    const imagePath = `public/images/${userName}${lectureId}.png`;
    const out = fs.createWriteStream(imagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', async () => {
        console.log('수료증 생성 완료.');

        // 데이터베이스에 저장
        const image_path = `images/${userName}${lectureId}.png`;
        const insertSql = `INSERT INTO CERTIFICATES (USERID, USERNAME, LECTUREID, ISSUEDATE, IMAGE_PATH)
            VALUES (?, ?, ?, NOW(), ?);`;
        const insertValues = [userId, userName, lectureId, image_path];
        db.query(insertSql, insertValues, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            if (result.affectedRows === 0) {
                return res.json({
                    success: false,
                    message: '수료증 발급 실패'
                });
            } else {
                res.json({
                    success: true,
                    message: '수료증 발급 성공'
                });
            }
        });
    });
});

// 이미 발급되었는지 확인하는 함수
function checkExistingCertificate(userId, lectureId) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM CERTIFICATES WHERE USERID = ? AND LECTUREID = ?;`;
        const values = [userId, lectureId];
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(result.length > 0);
            }
        });
    });
}

router.post('/certificatesList',(req,res)=>{
    const userId = req.body.UserID;
    console.log('수료증 리스트 요청',req.body);

    const sql = `SELECT C.* , L.TITLE 
    FROM CERTIFICATES C
    JOIN LECTURES L ON C.LECTUREID = L.LECTUREID 
    WHERE C.USERID = ?;`;
    const values = [userId];

    db.query(sql,values,(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if(result.length === 0){
            res.json({
                success: false,
                message: '발급된 수료증이 없습니다.'
            });
        }else{
            res.json({
                success: true,
                message: '수료증 로드 완료',
                result: result
            });
        }
    });
});

module.exports = router;