/**
 * 작성자 : 성우창
 * 작성일 : 24.01.12
 * 수정 : 24.01.14
 * endpoint : /api/lectureDetail
 * description : 
 */

const db = require('../DB/DBconn');
const router = require('express').Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

//강의 상세
router.post('/',(req,res) => {
    const lectureId = req.body.LectureID;
    const sql = `SELECT L.*,I.* FROM LECTURES L JOIN INSTRUCTOR I ON L.INSTRUCTORID = I.INSTRUCTORID WHERE L.LECTUREID = ?;`;
    const values = [lectureId];

    db.query(sql,values,(err,lectureDetail)=>{
        if(err){
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        const sql = `SELECT TITLE, TOCID FROM LECTURETOC WHERE PARENTTOC IS NULL AND LECTUREID = ? ;`;
        const values = [lectureId];

        db.query(sql,values,(err,toc) =>{
            if(err){
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            
            const sql = `SELECT * FROM BOARD WHERE LECTUREID = ? ;`;
            const values = [lectureId];

            db.query(sql,values,(err, board)=>{
                if(err){
                    console.error(err);
                return res.status(500).send('Internal Server Error');
                }
                if(lectureDetail.length === 0 || toc.length === 0 || board.length === 0){
                    res.json({
                        success : false,
                        Message : "응답 실패",   
                    });
                }else{
                    res.json({
                        success : true,
                        Message : "응답 성공",
                        lectureDetail : lectureDetail,
                        toc : toc,
                        board : board
                    });
                }
            });
        });
    });
});
//찜 or 수강하기
router.post('/enrollment',(req,res)=>{
    const lectureId = req.body.LectureID;
    const userId = req.body.UserID;
    console.log(lectureId,userId);

    const sql = `INSERT INTO ENROLLMENTS (LectureID,UserID) VALUE (?,?)`;
    const values = [lectureId,userId];

    db.query(sql,values,(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.json({
            success : true,
            message : '저장 성공'
        });
    });
});
//강의 리뷰 작성
router.post('/board_upload',(req,res)=>{
    const lectureId = req.body.LectureID;
    const userId = req.body.UserID;
    const title = req.body.Title;
    const content = req.body.Content;
    const score = req.body.Score;

    const sql = `INSERT INTO BOARD (LectureID, USERID, TITLE, CONTENT, Score) VALUE (?,?,?,?,?);`;
    const values = [lectureId,userId,title,content,score];

    db.query(sql,values,(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }else{
            console.log(result);
            res.json({
                success : true,
                message : '저장 성공'
            });
        }
    });
});

module.exports = router;