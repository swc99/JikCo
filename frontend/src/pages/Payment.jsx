import React from 'react'
import { Link } from 'react-router-dom'

const Payment = () => {
    return (
        <div className='payment'>
            <div className='paymentinner'>
                <div style={{ display: 'flex', flexDirection: 'row'}}>
                        <div>
                            <p>강의 이미지</p>
                        </div>
                        <div style={{ marginLeft: '50px' }}>
                        <p>강의 이름</p>
                        </div>
                        <div style={{ marginLeft: '50px' }}>
                            <p>강의 가격 : 00000<br/>교재 유무 : 없음</p>
                        </div>
                        <div style={{marginTop:'30px', marginLeft:'50px'}}>
                            <input type='radio' name='radio1' id='rd1'/>교재 구입 O
                            <input type='radio' name='radio1' id='rd1'/>교재 구입 X
                        </div>
                        <div style={{marginRight:'50px', marginLeft:'auto', marginTop:'30px'}}>
                            <input type='checkbox' name='selecte'/>
                        </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row'}}>
                        <div>
                            <p>강의 이미지</p>
                        </div>
                        <div style={{ marginLeft: '50px' }}>
                            <p>강의 이름</p>
                        </div>
                        <div style={{ marginLeft: '50px' }}>
                            <p>강의 가격 : 00000<br/>교재 유무 : 없음</p>
                        </div>
                        <div style={{marginTop:'30px', marginLeft:'50px'}}>
                            <input type='radio' name='radio1' id='rd1'/>교재 구입 O
                            <input type='radio' name='radio1' id='rd1'/>교재 구입 X
                        </div>
                        <div style={{marginRight:'50px', marginLeft:'auto', marginTop:'30px'}}>
                            <input type='checkbox' name='selecte'/>
                        </div>
                </div>

                <form>
                    <p>이름</p>
                    <input type="text" placeholder='Name' />
               
                    <p>이메일</p>
                    <input type="text" placeholder='Email' />

                    <p>연락처</p>
                    <input type="text" placeholder='Number' />

                    <p>인증 번호</p>
                    <input type="text" placeholder='code' />

                    <p>주소</p>
                    <input type="text" placeholder='address' />

                </form>
                <div style={{justifyContent:'flex-end', marginLeft:'auto'}}>
                    <p style={{marginRight:'20px'}}>총 금액 : 0000000</p>
                    <button>결제 하기</button>
                </div>

            </div>

        </div>
    )
}

export default Payment
