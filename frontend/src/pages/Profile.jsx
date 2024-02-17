/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.26
 * Description : User Info
 */
import React, {useEffect, useState, useContext} from 'react';
import { AuthContext} from '../context/AuthContext';
import defaultimage from '../img/DefaultImage.png';
import Infonav from '../components/Infonav';
const serverUrl = process.env.REACT_APP_SERVER_URL;

const Profile = () => {
    const [userInfo, setUserInfo] = useState({});
    const {currentUser, updateUserImage} = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        // 서버에서 유저 정보를 가져오는 요청
        fetch(`${serverUrl}/userInfo/?userId=${currentUser[0].UserID}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.UserInfo);
                    setUserInfo(data.UserInfo[0]);
                    
                } else {
                    console.error('유저 정보를 가져오는데 실패했습니다.');
                }
            })
            .catch((error) => {
                console.error('유저 정보를 가져오는데 실패했습니다.', error);
            });
    }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('이미지가 선택되지 않았습니다.');
            return; // 이미지가 선택되지 않았을 경우 함수 종료
        }
        console.log('이미지 저장 요청');
        const formData = new FormData();
        formData.append('image', file); // FormData에 파일 추가
        formData.append('UserID',currentUser[0].UserID);
        updateUserImage(formData);
    };
    
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile); // 파일 객체 설정
        setFileName(selectedFile.name); // 파일 제목 저장
    };

    return (
        <div className='myinfo'>
            
        <Infonav/>
            <div className='infoview' style={{padding:'10px'}}>
                <div style={{backgroundColor:'#fff',height:'500px',marginTop:'13px' , borderRadius:'10px'}}>
                    <div className='userinfo'>
                        <img style={{ margin: '30px', width: '100px', borderRadius:'10px' }} 
                        src={userInfo.UserImage != null ? `http://localhost:4000/${userInfo.UserImage}` : defaultimage} />
                        <div style={{ marginLeft: '200px', marginTop: '30px' }}>
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
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <button type='button'
                            style={{ height: '5%', marginTop: 'auto', marginLeft: '1%'}}
                            onClick={() => document.getElementById('file').click()}>
                            이미지 선택
                        </button>
                        <button style={{ height: '5%', marginTop: 'auto', marginLeft: '1%'}}
                        type='submit'>변경 완료</button>
                        <input
                            style={{ display: "none" }}
                            type="file"
                            id="file"
                            name=""
                            onChange={handleFileChange}
                        />
                    {fileName && <p>선택한 파일: {fileName}</p>}

                    </form>
                    <div>
                        <div style={{margin:'30px', display: 'flex', flexDirection: 'row'}}>
                            <div>
                                <h4>관심 분야</h4>
                                <ul style={{ display: 'flex', flexDirection: 'row' }}>
                                    <li style={{ margin: '20px' }}>{userInfo.CNAME1}</li>
                                    <li style={{ margin: '20px' }}>{userInfo.CNAME2}</li>
                                    <li style={{ margin: '20px' }}>{userInfo.CNAME3}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
