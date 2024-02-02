/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.02.01
 * Description : Lectrue list 
 */
import React, {useState, useEffect, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL;

const Cart = () => {
    const [nonStudyLectures, setNonStudyLectures] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const {currentUser} = useContext(AuthContext);
    const nav = useNavigate();

    useEffect(() => {
        // 서버에서 강의 정보를 가져오는 요청
        fetch(`${serverUrl}/userInfo/nonstudy_lecture?UserID=${currentUser[0].UserID}`) // 쿼리 파라미터에 실제 사용자 ID를 넣어주세요
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.nonStudy);
                    setNonStudyLectures(data.nonStudy);
                } else {
                    console.error('강의 정보를 가져오는데 실패했습니다.');
                    alert('찜 목록이 비어있습니다.')
                }
            })
            .catch((error) => {
                console.error('강의 정보를 가져오는데 실패했습니다.', error);
            });
    }, []);

    // 선택한 강의의 총 합계 금액 계산
    const totalAmount = nonStudyLectures && nonStudyLectures.length > 0
    ? nonStudyLectures.reduce(
          (total, lecture) => (selectedCourses.includes(lecture.TITLE) ? total + lecture.LECTUREPAY : total),
          0
      )
    : 0;
   
    

    // 선택한 강의 정보를 서버로 전송하는 함수
    const handlePayment = () => {
        // 서버로 선택한 강의 정보를 전송하는 로직
        console.log('선택한 강의:', selectedCourses);
    
        // 강의 아이디와 제목이 있는 배열
        const selectedCoursesInfo = nonStudyLectures
            .filter(lecture => selectedCourses.includes(lecture.TITLE))
            .map(lecture => ({
                LectureID: lecture.LectureID,
                TITLE: lecture.TITLE,
                Book: lecture.BOOK,
                LECTUREIMAGE: lecture.LECTUREIMAGE,
                LECTUREPAY: lecture.LECTUREPAY

            }));
    
        console.log('선택한 강의 정보:', selectedCoursesInfo);
        nav('/payment',{state : selectedCoursesInfo});
    };
    const handleDrop = async (lectureId) => {
        try {
            const res = await axios.post(`${serverUrl}/lectureDetail/enrollment/throw`, { LectureID: lectureId, UserID: currentUser[0].UserID });
    
            if (res.data.success) {
                // 삭제 성공 시 해당 강의를 찜 목록에서 UI에서 제거
                setNonStudyLectures(prevLectures => prevLectures.filter(lecture => lecture.LectureID !== lectureId));
                alert('삭제 성공');
            } else {
                alert('삭제 실패');
            }
        } catch (error) {
            console.error('삭제 중 에러 발생:', error);
            alert('삭제 중 오류 발생');
        }
    };


    return (
        <div className='myinfo'>
            <div className='infonav'>
                <ul style={{backgroundColor:'#fff', borderRadius:'10px'}}>
                    <li><Link className= 'link' to={'/profile'}>내 정보</Link></li>
                    <li><Link className= 'link' to={'/updateUserinfo'}>내 정보 수정</Link></li>
                    <li><Link className= 'link' to={'/myonline'}>수강 내역</Link></li>
                    <li><Link className= 'link' to={'/Cart'}>찜 목록</Link></li>
                    <li><Link className= 'link' to={'/paymentlist'}>결제 내역</Link></li>
                </ul>
            </div>
            <div className='infoview' style={{padding:'10px'}}>
                <div style={{backgroundColor:'#fff',height:'500px',marginTop:'13px' , borderRadius:'10px'}}>
                <div style={{display:'flex',justifyItems:'auto',padding:'5%'}}>
                {nonStudyLectures && nonStudyLectures.map((lecture) => (
                            <div key={lecture.TITLE} style={{ marginLeft: '20px' }}>
                                <img style={{height:'80px', width:'100px'}} src={lecture.LECTUREIMAGE}/>
                                <p style={{width:'120px'}}>{lecture.TITLE}</p>
                                <p>가격: {lecture.LECTUREPAY}</p>
                                <input
                                    type='checkbox'
                                    name='구매'
                                    checked={selectedCourses.includes(lecture.TITLE)}
                                    onChange={() => {
                                        if (selectedCourses.includes(lecture.TITLE)) {
                                            // 이미 선택된 경우, 해당 항목을 배열에서 제거
                                            setSelectedCourses(selectedCourses.filter(course => course !== lecture.TITLE));
                                        } else {
                                            // 선택되지 않은 경우, 해당 항목을 배열에 추가
                                            setSelectedCourses([...selectedCourses, lecture.TITLE]);
                                        }
                                    }}
                                />
                                <button style={{marginLeft:'50%'}} onClick={(e) =>handleDrop(lecture.LectureID)}>x</button>
                            </div>
                        ))}
                    </div>
                    <div className='pay'>
                        <p>총 합계: {totalAmount}</p>
                        <button onClick={handlePayment}>결제 하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;