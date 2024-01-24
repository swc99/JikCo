/**
 * 작성자 : 성우창
 * 작성일 : 24.01.12
 * 수정 : 24.01.15
 * endpoint : /api
 * description : code 정리, bcrypt, Token
 */

const db = require('../DB/DBconn');
const router = require('express').Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {auth} = require('../middleware/cookieJwtAuth');
const cors = require('cors');
const cookieparser = require('cookie-parser');


dotenv.config();

// const corsOptions = {
//     origin: 'http://localhost:3000',
//     credentials: true,
// };

// router.use(cors(corsOptions));
// router.use(cookieparser());

router.use(bodyParser.json());

//메인페이지
/**
 * 로그인이후 메인 페이지
 * -- 추천 강좌
SELECT TITLE , LECTUREIMAGE , STARTTIME, LECTUREID
FROM LECTURES
WHERE CATEGORYID IN (SELECT CATEGORYID1 FROM `USER` WHERE USERID = '1'
UNION
SELECT CATEGORYID2 FROM `USER` WHERE USERID = '1'
UNION
SELECT CATEGORYID3 FROM `USER` WHERE USERID = '1')
ORDER BY STARTTIME DESC ;
 */
router.get('/',(req,res) => {
    const cookies = req.cookies;
    const user = req.query.user;
    if(user != null){
        const sql = `SELECT TITLE , LECTUREIMAGE , STARTTIME, LECTUREID, reviewcount,reviewscore
        FROM LECTURES
        WHERE CATEGORYID IN (SELECT CATEGORYID1 FROM USER WHERE USERID = ?
        UNION
        SELECT CATEGORYID2 FROM USER WHERE USERID = ?
        UNION
        SELECT CATEGORYID3 FROM USER WHERE USERID = ?)
        ORDER BY STARTTIME DESC ;`;
        const values = [user,user,user];
        db.query(sql,values,(err,frresult)=>{
            if(err){
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            var Frlectures = frresult.map(row => ({
                ftitle: row.TITLE,
                flectureImage: row.LECTUREIMAGE,
                fstartTime: row.STARTTIME,
                fdescription: row.Description,
                flectureId: row.LECTUREID,
                freviewCount: row.reviewcount,
                freviewScore: row.reviewscore
            }))
            console.log(Frlectures);
            const sql = `SELECT *FROM JikCo.LECTURES ORDER BY STARTTIME DESC`;
            db.query(sql,(err, row) => {
            if(err){
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            
            var Lectures = row.map(row => ({
                title: row.Title,
                lectureImage: row.LectureImage,
                startTime: row.StartTime,
                description: row.Description,
                lectureId: row.LectureID,
                reviewCount: row.reviewcount,
                reviewScore: row.reviewscore
            }));
                console.log(Lectures);
                const sql = `SELECT CategoryName, CategoryID FROM CATEGORY ;`;
                db.query(sql,(err,result)=>{
                    if(err){
                        console.error(err);
                        return res.status(500).send('Internal Server Error');
                    }
                    var Category = result.map(result => ({
                        categoryName : result.CategoryName,
                        categoryId : result.CategoryID
                    }));
                    console.log(Category);
                    if(Lectures.length === 0 || Category.length === 0){
                        res.json({
                            success : false,
                            message : "데이터가 존재 하지 않습니다.",
                        });
                    }else{
                        res.json({
                            success : true,
                            message : "메인 화면 응답 성공",
                            lecturesList : Lectures,
                            categoryList : Category,
                            Frlectures : Frlectures
                        });
                    }
                });
            });


            })

        }else{
            const sql = `SELECT *FROM JikCo.LECTURES ORDER BY STARTTIME DESC`;
        db.query(sql,(err, row) => {
            if(err){
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            
            var Lectures = row.map(row => ({
                title: row.Title,
                lectureImage: row.LectureImage,
                startTime: row.StartTime,
                description: row.Description,
                lectureId: row.LectureID,
                reviewCount: row.reviewcount,
                reviewScore: row.reviewscore
            }));
            console.log(Lectures);
            const sql = `SELECT CategoryName, CategoryID FROM CATEGORY ;`;
            db.query(sql,(err,result)=>{
                if(err){
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }
                var Category = result.map(result => ({
                    categoryName : result.CategoryName,
                    categoryId : result.CategoryID
                }));
                console.log(Category);
                if(Lectures.length === 0 || Category.length === 0){
                    res.json({
                        success : false,
                        message : "데이터가 존재 하지 않습니다.",
                    });
                }else{
                    res.json({
                        success : true,
                        message : "메인 화면 응답 성공",
                        lecturesList : Lectures,
                        categoryList : Category
                    });
                }
            });
        });

    }
    
});
//검색
router.get('/search',(req,res) => {
    console.log(req.query);
    const categoryName = req.query.category;
    const sql = `SELECT L.LECTUREID ,L.TITLE ,L.LECTUREIMAGE , C.CATEGORYID ,C.CATEGORYNAME FROM LECTURES L
    JOIN CATEGORY C ON C.CATEGORYID = L.CATEGORYID WHERE C.CATEGORYNAME = ?`;
    const values = [categoryName];
    db.query(sql,values,(err,result) => {
        if(err){
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if(result.length === 0){
            res.json({
                success : false,
                message : "검색 실패"
            });

        }else{
            console.log(result);
            res.json(
                {
                    success : true,
                    Message : "검색 성공",
                    category : result
                }
            );
        }
    });
});
//로그인
router.post('/login', (req, res) => {
    const key = process.env.SECRET_KEY;
    console.log(key);
    const userEmail = req.body.userEmail;
    const password = req.body.userPassword;
    let token = "";

    const sql = `SELECT * FROM USER WHERE USEREMAIL = ?;`;
    const values = [userEmail];
    // 사용자 정보 조회
    db.query(sql,values , (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        // 사용자 정보가 존재하면 비밀번호 검증
        if (result.length > 0) {
            const hashedPassword = result[0].Password;

            // bcrypt를 사용하여 비밀번호 검증
            bcrypt.compare(password, hashedPassword, (compareErr, compareResult) => {
                if (compareErr) {
                    console.error(compareErr);
                    return res.status(500).send('Internal Server Error');
                }
                
                if (compareResult) {
                    token = jwt.sign(
                        {
                            type: "JWT",
                            userId: result.UserID
                        },
                        key,
                        {
                            expiresIn:"1h",
                            issuer:"토큰발급자"
                        }
                    );
                    res.cookie("accesstoken",token,{
                        httpOnly: true,
                        sameSite: 'lax', // or 'strict' or 'none' with 'secure' if HTTPS
                        // secure: true,
                        maxAge: 3600000
                    });
                    res.status(200).json({
                        success: true,
                        message: '로그인 성공',
                        userInfo: result,
                    });
                } else {
                    res.json({ success: false });
                }
            });
        } else {
            res.json({ success: false });
        }
    });
});
//로그아웃
router.get('/logout', (req, res) => {
    try {
      // 클라이언트로부터 쿠키를 얻기 위해 request.cookies 사용
      const cookies = req.cookies;
      console.log(cookies);
      if (cookies !== null) {
        for (const userToken in cookies) {
          if (cookies.hasOwnProperty(userToken)) {
            // 쿠키의 maxAge를 0으로 설정하여 쿠키 만료
            res.cookie(userToken, "", { maxAge: 0, httpOnly: true });
          }
        }
      }
      // 로그아웃 후 리다이렉트 또는 다른 응답을 수행할 수 있습니다.
    //   res.redirect("/");
      res.send('로그아웃 성공');

    } catch (error) {
      console.error("로그아웃 중 오류:", error);
      res.status(500).send("Internal Server Error");
    }
  });
//회원 가입
router.post('/signUp',(req,res) => {
    const userName = req.body.UserName;
    const userEmail = req.body.UserEmail;
    const userPhone = req.body.UserPhone;
    const password = req.body.Password;
    const categoryId1 = req.body.CategoryID1;
    const categoryId2 = req.body.CategoryID2;
    const categoryId3 = req.body.CategoryID3;
    // 비밀번호 해싱
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        const sql = `INSERT INTO USER (USERNAME, USEREMAIL, USERPHONE, PASSWORD, CATEGORYID1, CATEGORYID2, CATEGORYID3)
        VALUES (?, ?, ?, ?, ?, ?, ?);`;
        const values = [userName, userEmail, userPhone, hash, categoryId1, categoryId2, categoryId3];
        // 해시된 비밀번호를 데이터베이스에 저장
        db.query(sql,values , (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.json({
                success : true,
                message : '가입성공'
            });
        });
    });
});
//회원 가입-이메일 중복 체크
router.post('/signUp/emailduplicate',(req,res) => {
    const userEmail = req.body.UserEmail;
    const sql = `SELECT UserEmail FROM USER WHERE UserEmail = ?;`;
    const values = [userEmail];
    db.query(sql,values,(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if(result.length === 0){
            res.json({
                success : true,
                message : '사용가능한 이메일 입니다.'
            });
        }else{
            res.json({
                success : false,
                message : '이미 사용중인 이메일 입니다.'
            });
        }
        
        
    });
});

//강의 시청
router.post('/lecture_Status',(req,res)=>{
    const lectureId = req.body.LectureID;
    const sql = `SELECT T.*, M.*FROM LECTURESMATERIAL M JOIN LECTURETOC T ON T.TOCID  = M.TOCID  WHERE T.LECTUREID = ? AND M.LECTUREID = ?;`;
    const values = [lectureId,lectureId];
    db.query(sql,values,(err,lectureM)=>{
        if(err){
            res.send('강의 정보 로드 실패');
        }
        const sql = `SELECT * FROM LECTURES WHERE LECTUREID = ?;`;
        const values = [lectureId];
        db.query(sql,values,(err,lecture)=>{
            if(err){
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            if(lectureM.length === 0 || lecture.length === 0){
                res.json({
                    success : false,
                    Message : "데이터가 없습니다.",
                });
            }else{
                res.json({
                    success : true,
                    Message : "응답 성공",
                    LectureM : lectureM,
                    Lecture : lecture
                });
            }
            
        });
    });
});

module.exports = router;