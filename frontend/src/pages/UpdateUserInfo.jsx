/**
 * Author : woo
 * Date : 24.01.17
 * Last : 24.01.26
 * Description : Update User Info
 */
import React, {useContext, useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import defaultimage from '../img/DefaultImage.png';
const serverUrl = process.env.REACT_APP_SERVER_URL;

const UpdateUserInfo = () => {
    const {currentUser} = useContext(AuthContext);
    const [categorylist, setCategoryList] = useState(
        JSON.parse(localStorage.getItem("categoryList")) || null
    );
    const [inputs, setInputs] = useState({
        insertName:"",
        insertPhone: "",
        selectedCategories:currentUser[0].CategoryID1 && currentUser[0].CategoryID2 && currentUser[0].CategoryID3 ? 
        [currentUser[0].CategoryID1, currentUser[0].CategoryID2, currentUser[0].CategoryID3] : []
    });
    const [userInfo, setUserInfo] = useState({
        username: currentUser[0].UserName,
        phone: currentUser[0].UserPhone,
        userimage: currentUser[0].UserImage,
        category1: currentUser[0].CategoryID1,
        category2: currentUser[0].CategoryID2,
        category3: currentUser[0].CategoryID3,
    });
    const [sendData, setSendData] = useState({
        UserName: "",
        UserPhone: "",
        CategoryID1: "",
        CategoryID2: "",
        CategoryID3: "",
        UserID: "",
    })
    const nav = useNavigate();
    

    const handleCheckboxChange = (categoryId) => {
        const selectedCategories = [...inputs.selectedCategories];

        if (selectedCategories.includes(categoryId)) {
            // 이미 선택된 경우, 제거
            selectedCategories.splice(selectedCategories.indexOf(categoryId), 1);
        } else {
            // 선택되지 않은 경우, 추가 (단, 3개 이하일 때)
            if (selectedCategories.length < 3) {
                selectedCategories.push(categoryId);
            }
        }

        setInputs((prev) => ({ ...prev, selectedCategories }));
        
        
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(inputs.insertName === ""){
            inputs.insertName = userInfo.username;
        }
        if(inputs.insertPhone === ""){
            inputs.insertPhone = userInfo.phone;
        }
        if(inputs.selectedCategories.length != 3){
            alert('카테고리는 3개 선택해야합니다.');
            return;
        }
        console.log('수정된 사용자 정보:', inputs);
        setSendData((prevData) => ({
            ...prevData,
            UserName: inputs.insertName,
            UserPhone: inputs.insertPhone,
            CategoryID1 : inputs.selectedCategories[0],
            CategoryID2 : inputs.selectedCategories[1],
            CategoryID3 : inputs.selectedCategories[2],
            UserID: currentUser[0].UserID
        }));
    };

    useEffect(() => {
        if (sendData.UserName !== "" || sendData.UserPhone !== "") {
            console.log('업데이트된 사용자 정보 (sendData):', sendData);
            sendDataToBackend();
        }
    }, [sendData]);
    
    const sendDataToBackend = async () =>{
        const res = await axios.post(`${serverUrl}/userInfo/user_update`,sendData);
        if(res.data.success){
            alert('성공적으로 수정을 완료했습니다.')
            nav('/profile');
        }else{
            alert(`정보 수정 실패!!!!\n${res.data.message}`);
        }
    }
    return (
        <div className='myinfo'>
            <div className='infonav'>
                <ul style={{backgroundColor:'#fff', borderRadius:'10px'}}>
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
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <img style={{ margin: '5%', width: '18%' }}
                             src={userInfo.userimage ? `http://localhost:4000/${userInfo.userimage}`: defaultimage} />
                            <div style={{ display:'flex' , flexDirection:"column", margin:'10px'}}>
                                <label>
                                <h3>이름</h3>
                                    <input type="text" name="insertName" placeholder={userInfo.username} onChange={handleChange} />
                                </label>
                                <br />
                                <label>
                                <h3>연락처</h3>
                                    <input type="text" name="insertPhone" placeholder={userInfo.phone} onChange={handleChange} />
                                </label>
                                <br />
                            </div>
                        </div>
                        <h3 style={{marginLeft:'10px'}}>관심 분야</h3>
                        <div className='categoryList'>
                            {categorylist.map((category) => (
                                <label key={category.categoryId}>
                                    <input
                                        type='checkbox'
                                        checked={inputs.selectedCategories.includes(category.categoryId)}
                                        onChange={() => handleCheckboxChange(category.categoryId)}/>
                                    {category.categoryName}
                                </label>
                            ))}
                        </div>
                        <button style={{marginLeft:'10px'}} type="submit">정보 수정</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateUserInfo;