/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.02.16
 * Description : Lectrue list 
 */
import React, {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Infonav from '../components/Infonav';

const serverUrl = process.env.REACT_APP_SERVER_URL;

const Cart = () => {
    const [nonStudyLectures, setNonStudyLectures] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [nullMessage , setNullMessage] = useState(null);
    const {currentUser} = useContext(AuthContext);
    const nav = useNavigate();

    useEffect(() => {
        fetch(`${serverUrl}/userInfo/nonstudy_lecture?UserID=${currentUser[0].UserID}`) // 쿼리 파라미터에 실제 사용자 ID를 넣어주세요
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.nonStudy);
                    setNonStudyLectures(data.nonStudy);
                } else {
                    console.error('강의 정보를 가져오는데 실패했습니다.');
                    setNullMessage('찜 목록이 비어있습니다.');
                }
            })
            .catch((error) => {
                console.log('강의 정보를 가져오는데 실패했습니다.', error);
            });
    }, []);

    // 선택한 강의의 총 합계 금액 계산
    const totalAmount = nonStudyLectures && nonStudyLectures.length > 0
    ? nonStudyLectures.reduce(
          (total, lecture) => (selectedCourses.includes(lecture.TITLE) ? total + lecture.LECTUREPAY : total),
          0
      )
    : 0;

    const handlePayment = () => {
        console.log('선택한 강의:', selectedCourses);
        if(selectedCourses.length === 0){
            alert('결제할 강의가 선택 되지 않았습니다.');
            return;
        }
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
            <Infonav/>
            <div className='infoview' style={{padding:'10px'}}>
                <div style={{backgroundColor:'#fff',height:'500px',marginTop:'13px' , borderRadius:'10px',
                display:'grid', gridAutoRows:'350px 50px',gridGap:'18%'
                }}>
                    <div style={{display:'flex', flexDirection:'row',
                    justifyItems:'auto',padding:'3%',maxWidth: '700px', overflowX: 'auto'}}>
                        {nullMessage}
                        {nonStudyLectures && nonStudyLectures.map((lecture) => (
                            <div key={lecture.TITLE} 
                            style={{ margin:'5px', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
                             borderRadius:'10px',padding:'4px', display:'grid',
                             gridAutoRows:'80px 120px 30px 30px', gridRowGap: '8px'}}>
                                
                                <img style={{height:'80px', width:'120px'}} src={lecture.LECTUREIMAGE} alt=''/>
                                <p style={{width:'120px'}}>{lecture.TITLE}</p>
                                <p>가격: {lecture.LECTUREPAY}</p>
                                <div style={{marginTop:'auto'}}>
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
                                    <button className='deleteBTN' onClick={(e) =>handleDrop(lecture.LectureID)}>x</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='pay'>
                        <p style={{marginRight:'3%'}}>총 합계: {totalAmount}</p>
                        <button className='payBTN'
                        
                         onClick={handlePayment}>결제 하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;