/**
 * 작성자 : 성우창
 * 작성일 : 24.01.12
 * 수정 : 24.01.26
 * Endpoint : /api/userInfo
 * Description : 
 */

const db = require('../DB/DBconn');
const router = require('express').Router();
const bodyParser = require('body-parser');

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
    const sql = `SELECT L.LectureID ,L.TITLE, L.LectureImage , E.PaymentStatus , E.AttendanceRate
    FROM LECTURES L JOIN ENROLLMENTS E ON L.LECTUREID = E.LECTUREID 
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
    const lectureId = req.body.LectureID;
    const userId = req.body.UserID;
    // const paymentDate = req.body.PaymentDate;
    const pay = req.body.Pay;
    const address = req.body.Address;
    const name = req.body.Name;
    const email = req.body.Email;

    const sql = `
    INSERT INTO PAYMENTS (LectureID,USERID,PAYMENTDATE,PAY,ADDRESS,NAME,EMAIL) VALUE (?,?,NOW(),?,?,?,?);`;
    const values = [lectureId,userId,pay,address,name,email];

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

    const sql = `SELECT P.PAY, P.PAYMENTDATE , L.TITLE,L.LECTUREPAY ,L.BOOK AS B_PAY,P.BOOK FROM PAYMENTS P
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

module.exports = router;