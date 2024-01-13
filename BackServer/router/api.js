const db = require('../DB/DBconn');
const router = require('express').Router();
const bodyParser = require('body-parser');

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
    // res.sendFile(path.join(__dirname, '/reactapp/build/index.html'));
    db.query(`
    SELECT title, lectureImage, STARTTIME, LECTUREID
    FROM JikCo.LECTURES
    ORDER BY STARTTIME DESC`,(err, row) => {
        if(err){
            res.send('서버가 응답하지 않습니다 ㅜㅜ');
        }
        
        var Lectures = row.map(row => ({
            title: row.title,
            lectureImage: row.lectureImage,
            startTime: row.STARTTIME,
            lectureId: row.LECTUREID
        }));
        console.log(Lectures);
        db.query(`SELECT CategoryName, CategoryID FROM CATEGORY ;`,(err,result)=>{
            if(err){
                res.send('응답 x');
            }
            var Category = result.map(result => ({
                categoryName : result.CategoryName,
                categoryId : result.CategoryID
            }));
            console.log(Category);
            
            res.json({
                success : true,
                Message : "메인 화면 응답 성공",
                lecturesList : Lectures,
                categoryList : Category});
        });
    });
});
//검색
router.get('/search',(req,res) => {
    console.log(req.query);
    db.query(`
    SELECT L.LECTUREID ,L.TITLE ,L.LECTUREIMAGE , C.CATEGORYID ,C.CATEGORYNAME 
    FROM LECTURES L
    JOIN CATEGORY C ON C.CATEGORYID = L.CATEGORYID 
    WHERE C.CATEGORYNAME = '${req.query.category}'`,(err,result) => {
        if(err){
            res.send('정보가 없습니다.');
        }
        res.send(
            {
                success : true,
                Message : "메인 화면 응답 성공",
                category : result
            }
        );
    });
});
//로그인
router.post('/login',(req,res) => {
    const userEmail = req.body.UserEmail;
    const password = req.body.Password;
    console.log(userEmail,password);
    db.query(`
    SELECT * FROM USER
    WHERE USEREMAIL = ?
    AND PASSWORD = ?;`,[userEmail,password],(err,result)=>{
        if(err){
            res.send('잘못된 Password이거나 ID가 없습니다.');
        }
        console.log(result);

        res.json({
            success : true, 
            userInfo : result
        });
    });
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
    db.query(`
    INSERT INTO USER (USERNAME,USEREMAIL,USERPHONE,PASSWORD,CATEGORYID1,CATEGORYID2,CATEGORYID3)
    VALUE (?,?,?,?,?,?,?);
    `,[userName,userEmail,userPhone,password,categoryId1,categoryId2,categoryId3],(err,result)=>{
        if(err){
            res.send('가입 실패');
        }
        res.send('가입 성공')
    });
});
//회원 가입-이메일 중복 체크
router.post('/signUp/emailduplicate',(req,res) => {
    const userEmail = req.body.UserEmail;
    db.query(`
    SELECT UserEmail FROM USER
    WHERE UserEmail = ?;`,[userEmail],(err,result)=>{
        if(err){
            res.send('사용 가능한 이메일 입니다.');
        }
        res.send('이미 사용중인 이메일입니다.')
    })
});

//강의 시청
router.post('/lecture_Status',(req,res)=>{
    const lectureId = req.body.LectureID;
    db.query(`
    SELECT T.*, M.*
    FROM LECTURESMATERIAL M
    JOIN LECTURETOC T ON T.TOCID  = M.TOCID  
    WHERE T.LECTUREID = ? AND M.LECTUREID = ?;`,[lectureId,lectureId],(err,lectureM)=>{
        if(err){
            res.send('강의 정보 로드 실패');
        }
        db.query(`SELECT * FROM LECTURES WHERE LECTUREID = ?;`,[lectureId],(err,lecture)=>{
            if(err){
                res.send('강의 로드 실패');
            }
            res.json({
                Code : 200,
                Message : "응답 성공",
                LectureM : lectureM,
                Lecture : lecture
            });
        });
    });
});

module.exports = router;