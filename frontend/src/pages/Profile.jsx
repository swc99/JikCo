/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.17
 * Description : User Info
 */
import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import userimg from '../img/edit.png';
const serverUrl = process.env.REACT_APP_SERVER_URL;

const Profile = () => {
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        // 서버에서 유저 정보를 가져오는 요청
        fetch(`${serverUrl}/userinfo?userId=1`) // 쿼리 파라미터에 실제 사용자 ID를 넣어주세요
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.UserInfo);
                    setUserInfo(data.UserInfo[0]); // 첫 번째 요소를 가져옴 (유저 ID로 조회하므로 결과는 하나여야 함)
                } else {
                    console.error('유저 정보를 가져오는데 실패했습니다.');
                }
            })
            .catch((error) => {
                console.error('유저 정보를 가져오는데 실패했습니다.', error);
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

            <div className='infoview' style={{padding:'10px'}}>
                <div style={{backgroundColor:'#fff',height:'500px',marginTop:'13px' , borderRadius:'10px'}}>
                    <div className='userinfo'>
                        <img style={{ margin: '30px', width: '100px' }} src={userInfo.UserImg} />
                        <form style={{ marginLeft: '200px', marginTop: '30px' }}>
                            <table>
                                <tbody>
                                <tr>
                                    <td>이름 : </td>
                                    <td>{userInfo.UserName}</td>
                                </tr>
                                <tr>
                                    <td>이메일 : </td>
                                    <td>{userInfo.UserEmail}</td>
                                </tr>
                                <tr>
                                    <td>연락처 : </td>
                                    <td>{userInfo.UserPhone}</td>
                                </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                    <div>
                        <form style={{margin:'30px', display: 'flex', flexDirection: 'row'}}>
                            <div>
                                <h4>관심 분야</h4>
                                <ul style={{ display: 'flex', flexDirection: 'row' }}>
                                    <li style={{ margin: '20px' }}>{userInfo.CNAME1}</li>
                                    <li style={{ margin: '20px' }}>{userInfo.CNAME2}</li>
                                    <li style={{ margin: '20px' }}>{userInfo.CNAME3}</li>
                                </ul>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
