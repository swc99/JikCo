/**
 * Author : woo
 * Date : 24.01.17
 * Last : 24.01.17
 * Description : Update User Info
 */
import React, {useState} from 'react';
import { Link } from 'react-router-dom';


const UpdateUserInfo = () => {
    const [userInfo, setUserInfo] = useState({
        username: 'JohnDoe',
        phone: '01040872460',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 여기에 사용자 정보 업데이트 또는 API 호출 등을 추가하세요
        console.log('수정된 사용자 정보:', userInfo);
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
                <div style={{backgroundColor:'#fff',height:'500px',marginTop:'13px' , borderRadius:'10px'}}>
                    <form onSubmit={handleSubmit}>
                        <label>
                            사용자 이름:
                            <input type="text" name="username" value={userInfo.username} onChange={handleChange} />
                        </label>
                        <br />
                        <label>
                            연락처:
                            <input type="email" name="email" value={userInfo.phone} onChange={handleChange} />
                        </label>
                        <br />
                        <label>
                            관심 분야:
                            <input type="email" name="email" value={userInfo.category} onChange={handleChange} />
                        </label>
                        <br />
                        <button type="submit">정보 수정</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateUserInfo;
