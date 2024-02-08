/**
 * Author : woo
 * Date : 24.01.12
 * Last : 24.01.26
 * Endpoint : /api/lectureDetail
 * Description : 
 */
const db = require('../DB/DBconn');
const router = require('express').Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

//강의 상세
router.post('/',(req,res) => {
    console.log(`${req.body.LectureID},강의 정보 요청`);
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
                if(lectureDetail.length === 0 && toc.length === 0 && board.length === 0){
                    console.log('false');

                    res.json({
                        success : false,
                        Message : "응답 실패",   
                    });
                }else{
                    res.json({
                        success : true,
                        Message : "응답 성공",
                        lectureDetail : lectureDetail[0],
                        toc : toc,
                        board : board
                    });
                }
            });
        });
    });
});
//찜 or 수강하기
router.post('/enrollment', (req, res) => {
    const lectureId = req.body.LectureID;
    const userId = req.body.UserID;
    console.log(lectureId, userId);
    
    const selectSql = `SELECT * FROM ENROLLMENTS WHERE USERID = ? AND LECTUREID = ?;`
    const selectValues = [userId, lectureId];

    db.query(selectSql, selectValues, (selectErr, selectResult) => {
        if (selectErr) {
            console.error(selectErr);
            return res.status(500).send('Internal Server Error');
        }
        if (selectResult.length > 0) {
            return res.json({
                success: false,
                message: '이미 데이터가 있습니다.'
            });
        }else{
            const insertSql = `INSERT INTO ENROLLMENTS (LectureID, UserID) VALUES (?, ?);`;
            const insertValues = [lectureId, userId];

            db.query(insertSql, insertValues, (insertErr, insertResult) => {
                if (insertErr) {
                    console.error(insertErr);
                    return res.status(500).send('Internal Server Error');
                }
                if(insertResult.length === 0){
                    return res.json({
                        success: false,
                        message: '저장 실패'
                    });
                }else{
                    return res.json({
                        success: true,
                        message: '저장 성공'
                    });
                }
                
            });
        }
        
    });
});
//찜하기 취소
router.post('/enrollment/throw', (req, res) => {
    const lectureId = req.body.LectureID;
    const userId = req.body.UserID;
    console.log(lectureId, userId);
    
    const sql = `SELECT * FROM ENROLLMENTS WHERE USERID = ? AND LECTUREID = ? AND PAYMENTSTATUS = '0';`
    const values = [userId, lectureId];
    db.query(sql,values,(err,result)=>{
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if(result.length === 0){
            res.json({
                success: false,
                message: '데이터가 없습니다.'
            });
        }
        const sql = `DELETE FROM ENROLLMENTS WHERE USERID = ? AND LECTUREID = ? AND PAYMENTSTATUS = '0';`
        const values = [userId, lectureId];

        db.query(sql, values,(err,deleteResult)=>{
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            if(deleteResult.length === 0){
                res.json({
                    success: false,
                    message: '찜목록 삭제 실패'
                });
            }else{
                res.json({
                    success: true,
                    message: '찜목록 삭제 성공'
                });
            }
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

    const sql = `SELECT * FROM ENROLLMENTS WHERE LECTUREID = ? AND USERID = ? AND PAYMENTSTATUS ='1';`;
    const values = [lectureId,userId]

    db.query(sql,values,(err,selectResult)=>{
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if(selectResult.length === 0){
            res.json({
                success:false,
                message:'수강중인 강의가 아닙니다. ㅡ.ㅡ;;'
            });
        }else{
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
        }
    })
});

router.post('/tocInfoSet',(req,res)=>{
    const userId = req.body.UserID;
    const tocId = req.body.TOCID;
    const progress = req.body.Progress;
    const lectureId = req.body.LectureID;

    console.log(userId,tocId,progress);

    const sql = `SELECT * FROM VideoProgress WHERE USERID = ? AND TOCID = ?;`;
    const values = [userId,tocId];
    db.query(sql,values,(err,selectResult)=>{
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if(selectResult.length === 0){
            const sql = `INSERT INTO VideoProgress (USERID,TOCID,PROGRESS,LASTACCESSED,LECTUREID)
            VALUE (?,?,?,NOW(),?);`;
            const values = [userId,tocId,progress,lectureId];
            db.query(sql,values,(err,insertResult)=>{
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }
                if(insertResult.length === 0){
                    res.json({
                        success: false,
                        message: ' false'
                    });
                }else{
                    res.json({
                        success: true,
                        message: '성공'
                    });
                }
            });
        }else{
            const sql = `UPDATE VideoProgress SET Progress = ? WHERE USERID = ? AND TOCID = ?;`;
            const values = [progress,userId,tocId];
            db.query(sql,values,(err,updateResult)=>{
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }
                if(updateResult.length === 0){
                    res.json({
                        success: false,
                        message: '업데이트 실패'
                    });
                }else{
                    res.json({
                        success: true,
                        message: '업데이트 성공'
                    })
                }

            });
        }
    });

});

module.exports = router;