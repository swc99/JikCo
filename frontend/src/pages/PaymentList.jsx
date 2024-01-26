/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.26
 * Description : Payment List
 */
import React,{ useState, useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
const serverUrl = process.env.REACT_APP_SERVER_URL;

const PaymentList = () => {
    const [paymentList, setPaymentList] = useState([]);
    const {currentUser} = useContext(AuthContext);

    useEffect(() => {
        // 서버에서 결제 내역을 가져오는 요청
        fetch(`${serverUrl}/userInfo/payment_list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                UserID: `${currentUser[0].UserID}`, // 실제 사용자 ID를 넣어주세요
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.paymentList);
                    setPaymentList(data.paymentList);
                } else {
                    console.log('결제 내역이 없습니다.');
                    alert('결제 내역이 없습니다.');
                }
            })
            .catch((error) => {
                console.error('결제 내역을 가져오는데 실패했습니다.', error);
            });
    }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행



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
                <div style={{ backgroundColor: '#fff', height: '450px', marginTop: '13px', borderRadius: '10px' }}>
                    {paymentList.map((payment) => (
                        <div key={payment.PAYMENTDATE} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div style={{ marginLeft: '10px' }}>
                                <p>강의 이미지</p>
                            </div>
                            <div style={{ marginLeft: '10px' }}>
                                <p>강의 가격: {payment.LECTUREPAY}<br />교재 유무: {payment.BOOK ? '있음' : '없음'}</p>
                            </div>
                            <div style={{ marginLeft: 'auto', marginRight: '10px', marginTop: 'auto' }}>
                                <p>결제 금액: {payment.PAY}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PaymentList;
