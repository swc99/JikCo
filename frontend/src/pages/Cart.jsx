/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.18
 * Description : Lectrue list 
 */
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
const serverUrl = process.env.REACT_APP_SERVER_URL;

const Cart = () => {
    const [nonStudyLectures, setNonStudyLectures] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);

    useEffect(() => {
        // 서버에서 강의 정보를 가져오는 요청
        fetch(`${serverUrl}/userInfo/nonstudy_lecture?UserID=2`) // 쿼리 파라미터에 실제 사용자 ID를 넣어주세요
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.nonStudy);
                    setNonStudyLectures(data.nonStudy);
                } else {
                    console.error('강의 정보를 가져오는데 실패했습니다.');
                }
            })
            .catch((error) => {
                console.error('강의 정보를 가져오는데 실패했습니다.', error);
            });
    }, []);

    // 선택한 강의의 총 합계 금액 계산
    const totalAmount = nonStudyLectures.reduce(
        (total, lecture) => (selectedCourses.includes(lecture.TITLE) ? total + lecture.LECTUREPAY : total),
        0
    );

    // 선택한 강의 정보를 서버로 전송하는 함수
    const handlePayment = () => {
        // 서버로 선택한 강의 정보를 전송하는 로직
        console.log('선택한 강의:', selectedCourses);
        // 여기에서 서버로 선택한 강의 정보를 전송하면 됩니다.
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
            <br/>
            <div className='infoview' style={{padding:'10px'}}>
                <div style={{backgroundColor:'#fff',height:'500px',marginTop:'13px' , borderRadius:'10px'}}>
                <div style={{display:'flex',justifyItems:'auto'}}>
                {nonStudyLectures.map((lecture) => (
                            <div key={lecture.TITLE} style={{ marginLeft: '20px' }}>
                                <p>강의 이미지</p>
                                <p>{lecture.TITLE}</p>
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