/**
 * Author : woo
 * Date : 24.05.03
 * Last : 
 * Description : Register2
 */
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const serverUrl = process.env.REACT_APP_SERVER_URL;

const Register2 = () => {
    const nav = useNavigate();
    const [phoneNum, setPhoneNum] = useState(null);
    const [emailduplicate, setEmailduplicate] = useState('이메일 입력');
    const [pass, setPass] = useState('암호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.');
    const [inputs, setInputs] = useState({
        insertName:"",
        insertEmail: "",
        insertPhone: "",
        insertPassword: "",
        confirmPassword: "", // 추가: 비밀번호 확인용 필드
        selectedCategories:[]
    });
    const [registerdata, setData] = useState({
        UserName : "",
        UserEmail : "",
        UserPhone : "",
        Password : "",
        CategoryID1 : "",
        CategoryID2 : "",
        CategoryID3 : "",
    })
    const [categorylist, setCategoryList] = useState(
        JSON.parse(localStorage.getItem("categoryList")) || null
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'insertPhone' && value.length != 11 && !(/^\d+$/.test(value))){
            setPhoneNum(`허용하지 않는 형식 입니다. ex) - 제거`);
        }else{
            setPhoneNum(null);
        }
        setInputs((prev) => ({ ...prev, [name]: value }));

    };

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
        console.log(inputs);
        
    };

    const handlePasswordCheck = (e) => {
        const password = inputs.insertPassword;
        if(password === null || password === ""){
            setPass(' ');
        }
        // 최소 길이 검사
        if (password.length < 8) {
            setPass('암호는 최소 8자 이상이어야 합니다.');
            return;
        }

        // 대문자, 소문자, 숫자, 특수문자 포함 검사
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

        if (!regex.test(password)) {
            setPass('암호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.');
            return;
        }

        if (inputs.confirmPassword && inputs.confirmPassword != inputs.insertPassword) {
            setPass('암호가 일치하지 않습니다.');
            return;
        }
        setPass('암호 일치');
    };
    const handleRegistration = () => {
        console.log('가입 요청');
        sendDataToServer(registerdata);
    };

    const sendDataToServer = async (registerdata) => {
        const res = await axios.post(`${serverUrl}/signup`, registerdata);
        console.log('Server response:', res.data);
        if(res.data.success){
            console.log('가입 성공');
            nav('/login');
            alert(res.data.message);
        }else{
            alert(`${res.data.message}`);
        }
      };

    const isEmailValid = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    const emailCheck = async () =>{
        const email = inputs.insertEmail;
    // 이메일 형식 유효성 검사
        if (!isEmailValid(email)) {
            setEmailduplicate('유효한 이메일 형식이 아닙니다.');
            return;
        }
        const res = await axios.post(`${serverUrl}/signUp/emailduplicate`,{UserEmail:inputs.insertEmail});
        console.log(res.data);
        setEmailduplicate(res.data.message);
    }
    const nullCheck = ()=>{
        if(inputs.selectedCategories[2] != null){
            setData((prevData) => ({
                ...prevData,
                UserName: inputs.insertName,
                UserEmail: inputs.insertEmail,
                UserPhone: inputs.insertPhone,
                Password: inputs.insertPassword,
                CategoryID1 : inputs.selectedCategories[0],
                CategoryID2 : inputs.selectedCategories[1],
                CategoryID3 : inputs.selectedCategories[2],
            }));
            alert('작성 성공');
        }else{
            alert('작성하지 않은 부분을 확인해주세요');
        }
    }

    return (
        <div className='auth' style={{height:'100%'}}>
            <p>Register</p>
            <form>
                <input type="text" placeholder='username' name='insertName' 
                    value={inputs.insertName} onChange={handleChange}/>
                <input type="text" placeholder='Phone' name='insertPhone' 
                    value={inputs.insertPhone} onChange={handleChange}/>
                <h6 style={{ color: 'red', margin:'2px' }}>{phoneNum}</h6>
                <input type="email" placeholder='email' name='insertEmail' 
                    value={inputs.insertEmail} onChange={handleChange}/>
                <button style={{width:'100px'}} type='button' onClick={emailCheck}>중복 확인</button> 
                <h6 style={{ color: 'red', margin:'2px' }}>{emailduplicate}</h6>
                <input type="password" placeholder='password' 
                    name='insertPassword' value={inputs.insertPassword} onChange={handleChange} />
                <input type="password" placeholder='password check' 
                    name='confirmPassword' value={inputs.confirmPassword} onChange={handleChange}/>
                <h6 style={{ marginTop: '5px', marginBottom: '5px', color:'red' }}>
                    {pass}
                </h6>
                <button type="button" onClick={handlePasswordCheck}>암호 확인</button>
                <h6 style={{ color: 'red', marginTop:'5px', marginBottom:'5px' }}>3개 선택</h6>
                <div className='categoryList'>
                {categorylist.map((category) => (
                    <label key={category.categoryId}>
                        <input
                            type='checkbox'
                            checked={inputs.selectedCategories.includes(category.categoryId)}
                            onChange={() => handleCheckboxChange(category.categoryId)}
                        />
                        {category.categoryName}
                    </label>
                ))}
                </div>
                <button type='button' onClick={nullCheck}>작성 확인</button>
                <button type='button' onClick={handleRegistration}>가입 요청</button>
                <span>이미 계정이 있다면? <Link className='link' to="/login">Login</Link></span>
            </form>
        </div>
    );
}

export default Register2;
