/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.26
 * Description : Payment
 */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Payment = () => {
    const location = useLocation();
    const { state: selectedCoursesInfo } = location || { state: [] };
    const [lectureDetails, setLectureDetails] = useState([]);
    console.log(lectureDetails);

    // 선택한 강의와 교재 구매 여부에 따라 총 금액을 계산
    const calculateTotalAmount = () => {
        return lectureDetails.reduce((total, lecture) => {
            // lectureDetails에 있는 강의 중에서 선택한 강의만 계산
            if (lecture.selected) {
                // 교재 구매 여부에 따라 가격 계산
                total += lecture.LECTUREPAY + (lecture.hasBook ? 10000 : 0);
            }
            return total;
        }, 0);
    };

    // 강의 정보가 바뀔 때마다 총 금액을 업데이트
    useEffect(() => {
        //초기 상태
        setLectureDetails(selectedCoursesInfo.map(lecture => ({
            ...lecture,
            selected: false,
            hasBook: false,
        })));
    }, [selectedCoursesInfo]);

    // 선택한 강의의 교재 구매 여부 및 총 금액 업데이트
    const handleCheckboxChange = (index) => {
        setLectureDetails(prevDetails => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index].selected = !updatedDetails[index].selected;
            return updatedDetails;
        });
    };

    // 교재 구매 여부 업데이트
    const handleRadioChange = (index, hasBook) => {
        setLectureDetails(prevDetails => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index].hasBook = hasBook;
            return updatedDetails;
        });
    };

    return (
        <div className='payment'>
            <div className='paymentinner'>
                {lectureDetails.map((lecture, index) => (
                    <div key={lecture.LectureID} style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px' }}>
                        <div>
                            <img style={{width:'100px', height:'80px'}} src={lecture.LECTUREIMAGE}/>
                        </div>
                        <div style={{ marginLeft: '50px' }}>
                            <p>{lecture.TITLE}</p>
                        </div>
                        <div style={{ marginLeft: '50px' }}>
                            <p>강의 가격 : {lecture.LECTUREPAY}<br />교재 유무 : {lecture.Book !== null ? lecture.Book : '없음'}</p>
                        </div>
                        <div style={{ marginTop: '30px', marginLeft: '50px' }}>
                            <input
                                type='radio'
                                name={`book-radio-${lecture.LectureID}`}
                                id={`book-yes-${lecture.LectureID}`}
                                checked={lecture.hasBook}
                                onChange={() => handleRadioChange(index, true)}
                            />
                            <label htmlFor={`book-yes-${lecture.LectureID}`}>교재 구입 O</label>

                            <input
                                type='radio'
                                name={`book-radio-${lecture.LectureID}`}
                                id={`book-no-${lecture.LectureID}`}
                                checked={!lecture.hasBook}
                                onChange={() => handleRadioChange(index, false)}
                            />
                            <label htmlFor={`book-no-${lecture.LectureID}`}>교재 구입 X</label>
                        </div>
                        <div style={{ marginRight: '50px', marginLeft: 'auto', marginTop: '30px' }}>
                            <input
                                type='checkbox'
                                name={`select-${lecture.LectureID}`}
                                checked={lecture.selected}
                                onChange={() => handleCheckboxChange(index)}
                            />
                        </div>
                    </div>
                ))}

                <form>
                    <p>이름</p>
                    <input type="text" placeholder='이름' />

                    <p>이메일</p>
                    <input type="text" placeholder='이메일' />

                    <p>연락처</p>
                    <input type="text" placeholder='전화번호' />

                    <p>인증 번호</p>
                    <input type="text" placeholder='코드' />

                    <p>주소</p>
                    <input type="text" placeholder='주소' />
                </form>
                <div style={{ justifyContent: 'flex-end', marginLeft: 'auto' }}>
                    <p style={{ marginRight: '20px' }}>총 금액 : {calculateTotalAmount()}</p>
                    <button>결제 하기</button>
                </div>
            </div>
        </div>
    );
};

export default Payment;
