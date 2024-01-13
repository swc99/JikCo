const db = require('../DB/DBconn');
const router = require('express').Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

//강의 상세
router.post('/',(req,res) => {
    const lectureId = req.body.LectureID;
    db.query(`
    SELECT L.*,I.*
    FROM LECTURES L
    JOIN INSTRUCTOR I 
    ON L.INSTRUCTORID = I.INSTRUCTORID
    WHERE L.LECTUREID = ?;`,[lectureId],(err,lectureDetail)=>{
        if(err){
            res.send('서버가 응답하지 않습니다 ㅜㅜ');
        }
        db.query(`
        SELECT TITLE, TOCID FROM LECTURETOC 
        WHERE PARENTTOC IS NULL AND LECTUREID = ? ;`,[lectureId],(err,toc) =>{
            if(err){
                res.send('서버가 응답하지 않습니다 ㅜㅜ');
            }
            db.query(`
            SELECT * FROM BOARD 
            WHERE LECTUREID = ? ;`,[lectureId],(err, board)=>{
                if(err){
                    res.send('서버가 응답하지 않습니다 ㅜㅜ');
                }

                res.json({
                    Code : 200,
                    Message : "응답 성공",
                    lectureDetail : lectureDetail,
                    toc : toc,
                    board : board

                });
            });
        });
    });
});
//찜 or 수강하기
router.post('/enrollment',(req,res)=>{
    const lectureId = req.body.LectureID;
    const userId = req.body.UserID;
    console.log(lectureId,userId);
    db.query(`
    INSERT INTO ENROLLMENTS (LectureID,UserID) 
    VALUE (?,?)`,[lectureId,userId],(err,result)=>{
        if(err){
            res.send('오류');
        }else{
            console.log(result);
            res.send('찜하기 완료');
        }
       
    });
});
//강의 리뷰 작성
router.post('/board_upload',(req,res)=>{
    const lectureId = req.body.LectureID;
    const userId = req.body.UserID;
    const title = req.body.Title;
    const content = req.body.Content;
    const score = req.body.Score;
    db.query(`
    INSERT INTO BOARD (LectureID, USERID, TITLE, CONTENT, Score)
    VALUE (?,?,?,?,?);`,[lectureId,userId,title,content,score],(err,result)=>{
        if(err){
            throw err;
        }else{
            console.log(result);
            res.send('저장 성공');
        }
        
    });
});

module.exports = router;