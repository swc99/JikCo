/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.30
 * Description : Lectrue History 
 */
import React,{useState, useEffect, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProgressBar from '../components/ProgressBar';
const serverUrl = process.env.REACT_APP_SERVER_URL;



const MyOnline = () => {
    const [studyLecture, setStudyLectures ] = useState([]);
    const {currentUser} = useContext(AuthContext);
    const nav = useNavigate();

    

    useEffect(()=>{
        fetch(`${serverUrl}/userInfo/study_lecture/?UserID=${currentUser[0].UserID}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.message);
                    setStudyLectures(data.study);
                } else {
                    console.log(data.message);
                    alert('수강중인 강의가 없습니다.');
                }
            })
            .catch((error) => {
                console.error('강의 정보를 가져오는데 실패했습니다.', error);
            });
    },[]);

    const handlesubmit = (lecturID) => {
        console.log('가져올 강의 아이디',lecturID);
        nav(`/onlinestudy/${lecturID}`);
    };

    const handleClickReview = (lecturID) => {
        console.log('리뷰를 작성 하고 싶은 강의 아이디',lecturID);
        nav(`/lectureDetail/${lecturID}`);
    };
    return (
        <div className='myinfo' style={{height:'550px'}}>

            <div className='infonav'>
                <ul style={{backgroundColor:'#fff', borderRadius:'10px',marginTop:'45px'}}>
                    <li><Link className= 'link' to={'/profile'}>내 정보</Link></li>
                    <li><Link className= 'link' to={'/updateUserinfo'}>내 정보 수정</Link></li>
                    <li><Link className= 'link' to={'/myonline'}>수강 내역</Link></li>
                    <li><Link className= 'link' to={'/Cart'}>찜 목록</Link></li>
                    <li><Link className= 'link' to={'/paymentlist'}>결제 내역</Link></li>
                </ul>            
            </div>

            <div className='infoview' style={{padding:'10px'}}>
                <div style={{display:'flex', flexDirection:'column', maxHeight: '600px', overflowY: 'auto', 
                backgroundColor:'#fff',height:'500px',marginTop:'13px' , borderRadius:'10px'}}>
                    
                    {studyLecture.map((lecture) => (
                            <div className='lecturelist' key={lecture.LectureID}>
                                <img style={{height:'80px', width:'100px'}} src={lecture.LectureImage}/>
                                <p style={{width:'25%', maring:'10px'}}>{lecture.TITLE}</p>
                                <div  style={{width:'300px', marginBottom:'5px',padding:'10px'}}>
                                <ProgressBar progress={lecture.AttendanceRate}/>
                                </div>
                                <div className='keepbtn' style={{display:'flex',flexDirection:'column', width:'100px'}}>
                                    <button onClick={()=>handlesubmit(lecture.LectureID)}>이어 보기</button>
                                    <button onClick={()=>handleClickReview(lecture.LectureID)}>리뷰</button>
                                </div>
                            </div>
                        ))}

                </div>
            </div>
        </div>
    );
}

export default MyOnline;
