/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.31
 * Description : My Lectrue 
 */
import React,{useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProgressBar from '../components/ProgressBar';
import Infonav from '../components/Infonav';
import axios from "axios";

const serverUrl = process.env.REACT_APP_SERVER_URL;

const MyOnline = () => {
    const [nullMessage , setNullMessage] = useState(null);
    const [studyLecture, setStudyLectures ] = useState([]);
    const {currentUser} = useContext(AuthContext);
    const nav = useNavigate();

    useEffect(()=>{
        fetch(`${serverUrl}/userInfo/study_lecture/?UserID=${currentUser[0].UserID}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data);
                    setStudyLectures(data.study);
                } else {
                    console.log(data.message);
                    setNullMessage('수강중인 강의가 없습니다.');
                }
            })
            .catch((error) => {
                console.log('강의 정보를 가져오는데 실패했습니다.', error);
            });
    },[currentUser]);

    const handlesubmit = (lecturID) => {
        console.log('가져올 강의 아이디',lecturID);
        nav(`/onlinestudy/${lecturID}`);
    };

    const handleClickReview = (lecturID) => {
        console.log('리뷰를 작성 하고 싶은 강의 아이디',lecturID);
        nav(`/lectureDetail/${lecturID}`);
    };

    const handleClickCertificates = async (lecturID,Title,INSTRUCTORNAME) =>{
        const res = await axios.post(`${serverUrl}/userInfo/certificates`,{
            UserID: currentUser[0].UserID,
            UserName: currentUser[0].UserName,
            LectureID: lecturID,
            LectureTitle: Title,
            INSTRUCTORNAME: INSTRUCTORNAME
        });
        console.log(res.data);
        if(res.data.success){
            console.log(res.data.message);
            alert(res.data.message);
        }else{
            console.log(res.data.message);
            alert(res.data.message);
        }
    }
    return (
        <div className='myinfo'>
                    <Infonav/>
            <div className='infoview' style={{padding:'10px'}}>
                <div style={{display:'flex', flexDirection:'column', maxHeight: '600px', overflowY: 'auto', 
                backgroundColor:'#fff',height:'500px',marginTop:'13px' , borderRadius:'10px'}}>
                    {nullMessage}
                    {studyLecture.map((lecture) => (
                            <div className='lecturelist' key={lecture.LectureID}>
                                <img style={{height:'80px', width:'100px'}} src={lecture.LectureImage} alt=''/>
                                <p style={{width:'25%', maring:'10px'}}>{lecture.TITLE}</p>
                                <div  style={{width:'300px', marginBottom:'5px',padding:'10px'}}>
                                <ProgressBar progress={lecture.AttendanceRate}/>
                                </div>
                                <div className='keepbtn' style={{display:'flex',flexDirection:'column', width:'100px'}}>
                                    <button style={{marginBottom:'2px'}} onClick={()=>handlesubmit(lecture.LectureID)}>이어 보기</button>
                                    <button style={{marginBottom:'2px'}} onClick={()=>handleClickReview(lecture.LectureID)}>리뷰</button>
                                    {lecture.AttendanceRate !== 100 ? null : 
                                    <button style={{marginBottom:'2px'}} 
                                    onClick={()=>handleClickCertificates(lecture.LectureID,lecture.TITLE,lecture.INSTRUCTORNAME)}>수료증</button>}
                                </div>
                            </div>
                        ))}

                </div>
            </div>
        </div>
    );
}

export default MyOnline;
