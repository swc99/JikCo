/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.02.14
 * Description : Payment
 */
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const IMP = window.IMP;
const marketId = process.env.REACT_APP_MARKETID;

const Payment = () => {
    const {currentUser} = useContext(AuthContext);
    const nav = useNavigate();
    const location = useLocation();
    const { state: selectedCoursesInfo } = location || { state: [] };
    const [lectureDetails, setLectureDetails] = useState([]);
    console.log(lectureDetails);
    const [formData, setFormData] = useState({
        name: currentUser[0].UserName,
        email: currentUser[0].UserEmail,
        phone: currentUser[0].UserPhone,
        address: ''
    });

    // 선택한 강의와 교재 구매 여부에 따라 총 금액을 계산
    const calculateTotalAmount = () => {
        return lectureDetails.reduce((total, lecture) => {
            // lectureDetails에 있는 강의 중에서 선택한 강의만 계산
            if (lecture.selected) {
                // 교재 구매 여부에 따라 가격 계산
                total += lecture.LECTUREPAY + (lecture.hasBook ? lecture.Book : 0);
            }
            return total;
        }, 0);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // 강의 정보가 바뀔 때마다 총 금액을 업데이트
    useEffect(() => {
        setLectureDetails(selectedCoursesInfo.map(lecture => ({
            ...lecture,
            selected: false,
            hasBook: 0,
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
    const make_merchant_uid = () => {
        const current_time = new Date();
        const year = current_time.getFullYear().toString();
        const month = (current_time.getMonth() + 1).toString();
        const day = current_time.getDate().toString();
        const hour = current_time.getHours().toString();
        const minute = current_time.getMinutes().toString();
        const second = current_time.getSeconds().toString();
        const merchant_uid = "MIHEE" + year + month + day + hour + minute + second;
        return merchant_uid;
      };
    const merchant_uid = make_merchant_uid();
    
    const onClickpay = async (paymentType) => {
        let pg = '';
        if(paymentType === 'general'){
            pg = 'html5_inicis';
        } else if(paymentType === 'kakao'){
            pg = 'kakaopay';
        }
        const totalAmount = calculateTotalAmount();
        IMP.init(marketId);
        
        // 결제 정보를 담을 배열
        const paymentData = [];
    
        // 선택된 강의들에 대한 결제 정보를 생성
        for (const lecture of lectureDetails) {
            if (lecture.selected) {
                paymentData.push({
                    LectureID: lecture.LectureID,
                    Pay: lecture.LECTUREPAY + (lecture.hasBook ? lecture.Book : 0),
                    HasBook: lecture.hasBook
                });
            }
        }
    
        // 결제 요청 보내기
        IMP.request_pay({
            pg: pg,
            pay_method: 'card',
            merchant_uid: merchant_uid,
            name: '강의 결제',
            amount: totalAmount,
            buyer_email: formData.email,
            buyer_name: formData.name,
            buyer_tel: formData.phone,
            buyer_address: formData.address,
            custom_data: { lectures: paymentData }
        },async (rsp)=>{
            console.log(rsp);
            if(rsp.success){
                for (const lecturePayment of paymentData) {
                    try {
                        const res = await axios.post(`${serverUrl}/userInfo/payment`, {
                            LectureID: lecturePayment.LectureID,
                            UserID: currentUser[0].UserID,
                            Pay: lecturePayment.Pay,
                            Address: formData.address,
                            Name: formData.name,
                            Email: formData.email,
                            HasBook: lecturePayment.HasBook
                        });
                        if (res.data.success) {
                            console.log(res.data.message);
                            alert('결제 성공');
                            nav('/myonline');
                        } else {
                            console.log(res.data.message);
                            alert('결제 실패');
                            nav('/cart');
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            }else{
                alert(rsp.error_msg);
                return;
            }
            
        });
    
        
    };

    return (
        <div className='payment' style={{width:'1024px'}}>
            <div className='paymentinner'>
                {lectureDetails.map((lecture, index) => (
                    <div key={lecture.LectureID} style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px' }}>
                        <div>
                            <img style={{width:'100px', height:'80px'}} src={lecture.LECTUREIMAGE}/>
                        </div>
                        <div style={{ marginLeft: '50px' ,width:'250px'}}>
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
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        placeholder='이름' 
                        onChange={handleInputChange} 
                        required 
                    />

                    <p>이메일</p>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        placeholder='이메일' 
                        onChange={handleInputChange} 
                        required 
                    />

                    <p>연락처</p>
                    <input 
                        type="text" 
                        name="phone" 
                        value={formData.phone} 
                        placeholder='전화번호' 
                        onChange={handleInputChange} 
                        required 
                    />

                    <p>주소</p>
                    <input 
                        type="text" 
                        name="address" 
                        value={formData.address} 
                        placeholder='주소' 
                        onChange={handleInputChange} 
                        required 
                    />
                    <h5 style={{color:'red'}}>
                        <strong style={{fontSize: '1.2em', fontWeight: 'bold'}}>교재</strong>를 구입할 경우 
                    <strong style={{fontSize: '1.2em', fontWeight: 'bold'}}>주소</strong>를 입력해 주세요!
                    </h5>
                </form>
                <div style={{ justifyContent: 'flex-end', marginLeft: 'auto' }}>
                    <p style={{ marginRight: '20px' }}>총 금액 : {calculateTotalAmount()}</p>
                    <button style={{width:'55%'}} onClick={()=>onClickpay('general')}>일반 결제</button>
                    <button style={{width:'55%'}} onClick={()=>onClickpay('kakao')}>카카오 페이</button>
                </div>
            </div>
        </div>
    );
};

export default Payment;
