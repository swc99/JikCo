/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.17
 * Description : Register
 */
import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <div className='auth'>
            <p>Register</p>
            <form>
                <table className='frtable'>
                    <tbody>
                        <tr>
                            <td><input type="text" placeholder='username' /></td>
                        </tr>
                        <tr>
                            <td><input type="text" placeholder='Phone' /></td>
                        </tr>
                        <tr>
                            <td>
                                <input type="email" placeholder='email' />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button>중복 확인</button>
                                <script>
                                </script> 
                                <h6 style={{ color: 'red' }}>이미 사용중인 이메일 입니다.</h6>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="3"><input type="password1" placeholder='password' /></td>
                        </tr>
                        <tr>
                            <td colSpan="3"><input type="password2" placeholder='password check' /></td>
                        </tr>
                        <tr>
                            <td colSpan="3" style={{ color: 'red' }}><h6>비밀번호가 일치하지 않습니다.</h6></td>
                        </tr>
                        <tr>
                            <td colSpan="3">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td><label><input type='checkbox' /> Backend</label></td>
                                            <td><label><input type='checkbox' /> Frontend</label></td>
                                        </tr>
                                        <tr>
                                            <td><label><input type='checkbox' /> JAVA</label></td>
                                            <td><label><input type='checkbox' /> Python</label></td>
                                        </tr>
                                        <tr>
                                            <td><label><input type='checkbox' /> Node.js</label></td>
                                            <td><label><input type='checkbox' /> DB</label></td>
                                        </tr>
                                        <tr>
                                            <td><label><input type='checkbox' /> Oracle</label></td>
                                            <td><label><input type='checkbox' /> MySQL</label></td>
                                        </tr>
                                        <tr>
                                            <td><label><input type='checkbox' /> HTML</label></td>
                                            <td><label><input type='checkbox' /> CSS</label></td>
                                        </tr>
                                        <tr>
                                            <td><label><input type='checkbox' /> Javascript</label></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="3"><button>가입 신청</button></td>
                        </tr>
                    </tbody>
                </table>
                <span>이미 계정이 있다면? <Link className='link' to="/login">Login</Link></span>
            </form>
        </div>
    );
}

export default Register;
