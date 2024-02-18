/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.02.16
 * Description : Certificates (수료증)
 */
import React,{ useState, useEffect, useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import Infonav from '../components/Infonav';
import axios from "axios";
import down from '../img/upload2.png'
const serverUrl = process.env.REACT_APP_SERVER_URL;

const Certificates = () => {
    const [nullMessage , setNullMessage] = useState(null);
    const [certificatesList, setcertificatesList] = useState([]);
    const {currentUser} = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post(`${serverUrl}/userInfo/certificatesList`, {
                    UserID: currentUser[0].UserID
                });
                if (res.data.success) {
                    console.log(res.data.result);
                    setcertificatesList(res.data.result);
                } else {
                    setNullMessage(res.data.message);
                }
            } catch (error) {
                console.error('Error fetching certificates:', error);
                setNullMessage('서버에서 수료증을 가져오는 중에 오류가 발생했습니다.');
            }
        }
        fetchData();
    }, [currentUser]);

    const downloadCertificate = async (imagePath) => {
        try {
            console.log(imagePath);
            const fileName = imagePath.split('/').pop();
            console.log(fileName);
            const response = await axios.post(`${serverUrl}/images`, { fileName : fileName }, {
                responseType: 'blob' // 이진 파일로 응답 받음
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'certificate.png');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading certificate:', error);
        }
    }

    return (
        <div className='myinfo'>
            <Infonav/>
            <div className='infoview' style={{padding:'10px'}}>
                <div style={{display:'flex', flexDirection:'column', maxHeight: '600px', overflowY: 'auto', 
                backgroundColor:'#fff',height:'500px',marginTop:'13px' , borderRadius:'10px'}}>
                    {nullMessage}
                    {certificatesList && certificatesList.map((certificates) => (
                        <div key={certificates.CERTIFICATEID} 
                        style={{ margin:'5px',display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderRadius:'5px',
                        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)' }}>
                            <div style={{ marginLeft: '10px' }}>
                                <img style={{height:'80px', width:'100px'}} src={`http://localhost:4000/${certificates.IMAGE_PATH}`} alt=''/>
                            </div>
                            <div style={{ marginLeft: '2%', marginTop:'2%'}}>
                                <p>{certificates.TITLE}</p>
                            </div>
                            <div style={{ marginLeft: 'auto', marginRight: '20px', marginTop: 'auto',
                            display:'flex',flexDirection:'column' }}>
                                <p style={{marginTop:'20px'}}>발급 날짜:  {new Date(certificates.ISSUEDATE).toLocaleDateString()}</p>
                                <img className='downloadimg'
                                style={{marginLeft:'auto',marginBottom:'3px', width:'40px',height:'30px'}} 
                                onClick={() => downloadCertificate(certificates.IMAGE_PATH)} 
                                src={down}
                                alt='download'/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Certificates;
