const db = require('../DB/DBconn');
const router = require('express').Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

//유저 정보 조회
router.get('/userinfo',(req,res)=>{
    console.log(req.query);
    db.query(`
    SELECT U.*, C1.CATEGORYNAME AS CNAME1, C2.CATEGORYNAME AS CNAME2,C3.CATEGORYNAME AS CNAME3
    FROM USER U
    JOIN CATEGORY C1 ON C1.CATEGORYID = U.CATEGORYID1
    JOIN CATEGORY C2 ON C2.CATEGORYID = U.CATEGORYID2
    JOIN CATEGORY C3 ON C3.CATEGORYID = U.CATEGORYID3
    WHERE U.USERID ='${req.query.userId}';`,(err,result)=>{
        if(err){
            res.send('조회 실패');
        }
        console.log(result);
        
        res.send({UserInfo : result});
    });
});
//유저 정보 수정
router.post('/user_update',(req,res)=>{
    const userName = req.body.UserName;
    const categoryId1 = req.body.CategoryID1;
    const categoryId2 = req.body.CategoryID2;
    const categoryId3 = req.body.CategoryID3;
    const userId = req.body.UserID;
    db.query(`
    UPDATE USER
    SET USERNAME = ?,CATEGORYID1 = ?,CATEGORYID2 =?,CATEGORYID3 =?
    WHERE USERID = ?;`,[userName,categoryId1,categoryId2,categoryId3,userId],(err,result)=>{
        if(err){
            res.send('저장 실패');
        }
        console.log(result);
        res.send('저장 성공');
    });
});
//수강 내역
router.get('/study_lecture',(req,res)=>{
    db.query(`
    SELECT L.TITLE, E.PaymentStatus  FROM LECTURES L 
    JOIN ENROLLMENTS E ON L.LECTUREID = E.LECTUREID 
    WHERE E.USERID = '${req.query.UserID}' AND E.PaymentStatus IS TRUE ;`,(err,result)=>{
        if(err){
            res.send('조회 실패');
        }
        console.log(result);
        res.send({
            Code : 200,
            Message : "응답 성공",
            Study : result
        });
    });
});
//찜 목록
router.get('/nonstudy_lecture',(req,res)=>{
    db.query(`
    SELECT L.TITLE,L.LECTUREPAY ,L.BOOK ,L.LECTUREIMAGE ,E.PaymentStatus 
    FROM LECTURES L 
    JOIN ENROLLMENTS E ON L.LECTUREID = E.LECTUREID 
    WHERE E.USERID = '${req.query.UserID}' AND E.PaymentStatus IS FALSE  ;`,(err,result)=>{
        if(err){
            res.send('조회 실패');
        }
        res.send({
            Code : 200,
            Message : "응답 성공",
            nonStudy : result
        });
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
    db.query(`
    INSERT INTO PAYMENTS (LectureID,USERID,PAYMENTDATE,PAY,ADDRESS,NAME,EMAIL)
    VALUE (?,?,NOW(),?,?,?,?);`,
    [lectureId,userId,pay,address,name,email],(err,result)=>{
        if(err){
            res.send('실패');
        }
        db.query(`
        UPDATE ENROLLMENTS SET PAYMENTSTATUS = TRUE
        WHERE USERID = ? AND LECTUREID = ?;`,[userId,lectureId],(err,stupdate)=>{
            if(err){
                res.send('결제 유무확인 불가');
            }
            res.send('구매 성공~')
        });
    });
});
//결제 내역
router.post('/payment_list',(req,res)=>{
    const userId = req.body.UserID;
    db.query(`
    SELECT P.PAY, P.PAYMENTDATE , L.TITLE,L.LECTUREPAY ,L.BOOK AS B_PAY,P.BOOK 
    FROM PAYMENTS P
    JOIN LECTURES L ON L.LECTUREID = P.LECTUREID
    WHERE P.USERID = ?;`,[userId],(err,result)=>{
        if(err){
            res.send('결제 내역 조회 실패ㅜㅜ');
        }
        console.log(result);
        res.send({
            Code : 200,
            Message : "응답 성공",
            PaymentList : result
        });
    });
});

module.exports = router;