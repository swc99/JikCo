/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.18
 * Description : Lectrue History 
 */
import React,{useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
const serverUrl = process.env.REACT_APP_SERVER_URL;

const MyOnline = () => {
    const [studyLecture, setStudyLectures ] = useState([]);

    useEffect(()=>{
        fetch(`${serverUrl}/userInfo/study_lecture?UserID=2`) // 쿼리 파라미터에 실제 사용자 ID를 넣어주세요
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.study);
                    setStudyLectures(data.study);
                } else {
                    console.error('강의 정보를 가져오는데 실패했습니다.');
                }
            })
            .catch((error) => {
                console.error('강의 정보를 가져오는데 실패했습니다.', error);
            });
    },[]);

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
                <div style={{backgroundColor:'#fff',height:'500px',marginTop:'13px' , borderRadius:'10px'}}>
                    
                    {studyLecture.map((lecture) => (
                            <div className='lecturelist' key={lecture.LectureID}>
                                <p>강의 이미지{lecture.LECTUREIMAGE}</p>
                                <p>{lecture.TITLE}</p>
                                <p>{lecture.AttendanceRate}</p>
                                <div className='keepbtn'>
                                    <button>이어 보기</button>
                                    <button>리뷰</button>
                                </div>
                            </div>
                        ))}

                </div>
            </div>
        </div>
    );
}

export default MyOnline;