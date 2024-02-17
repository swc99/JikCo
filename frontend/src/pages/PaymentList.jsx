/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.02.16
 * Description : Payment List
 */
import React,{ useState, useEffect, useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import Infonav from '../components/Infonav';
const serverUrl = process.env.REACT_APP_SERVER_URL;

const PaymentList = () => {
    const [nullMessage , setNullMessage] = useState(null);
    const [paymentList, setPaymentList] = useState([]);
    const {currentUser} = useContext(AuthContext);

    useEffect(() => {
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
                    console.log('구매 리스트',data.paymentList);
                    setPaymentList(data.paymentList);
                } else {
                    console.log('결제 내역이 없습니다.');
                    setNullMessage('결제 내역이 없습니다.');
                }
            })
            .catch((error) => {
                console.log('결제 내역을 가져오는데 실패했습니다.', error);
            });
    }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행

    return (
        <div className='myinfo'>
                                <Infonav/>
            <br/>
            <div className='infoview' style={{padding:'10px'}}>
                <div  style={{display:'flex', flexDirection:'column', maxHeight: '600px', overflowY: 'auto', 
                backgroundColor:'#fff',height:'500px',marginTop:'13px' , borderRadius:'10px'}}>
                    {nullMessage}
                    {paymentList.map((payment) => (
                        <div key={payment.PAYMENTDATE}style={{ margin:'5px',display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderRadius:'5px',
                        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)' }}>
                            <div style={{ marginLeft: '10px' }}>
                                <img style={{height:'80px', width:'100px'}} src={payment.LECTUREIMAGE} alt=''/>
                            </div>
                            <div style={{marginLeft:'10px', width:'25%',marginTop:'20px'}}>
                                {payment.TITLE}
                            </div>
                            <div style={{ marginLeft: '10px' }}>
                                <p>강의 가격: {payment.LECTUREPAY}</p>
                                <p>교재 가격: {payment.BOOK !== 0 ? payment.B_PAY : (payment.B_PAY !== null ? '구입 X' : '없음')}</p>
                            </div>
                            <div style={{ marginLeft: 'auto', marginRight: '20px', marginTop: 'auto' }}>
                                <p>결제 금액: {payment.PAY}</p>
                                <p>결제 날짜:  {new Date(payment.PAYMENTDATE).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PaymentList;
