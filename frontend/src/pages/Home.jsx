/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.24
 * Description : Main Home
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import homeimg from '../img/Jikcoimg.jpg';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL;

const Home = () => {
    const nav = useNavigate();
    const [lecturelistHome, setMainHome] = useState([]);
    const [categorylist, setCategory] = useState([]);
    const [Frlectures, setfrLectures] = useState([]);
    const { currentUser } = useContext(AuthContext);

    const handleSubmit = (lecturID) => {
        nav(`/lectureDetail/${lecturID}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = `${serverUrl}/`;
                if (currentUser && currentUser.length > 0 && currentUser[0].UserID != null) {
                    url = `${serverUrl}/?user=${currentUser[0].UserID}`;
                }

                const response = await axios(url);
                const data = response.data;

                if (data.success && url === `${serverUrl}/`) {
                    setMainHome(data.lecturesList);
                    setCategory(data.categoryList);

                    localStorage.setItem('categoryList', JSON.stringify(data.categoryList));
                } else if(data.success && data.Frlectures != null){
                    setMainHome(data.lecturesList);
                    setCategory(data.categoryList);
                    setfrLectures(data.Frlectures);
                    localStorage.setItem('categoryList', JSON.stringify(data.categoryList));

                }else {
                    console.error('홈 정보를 가져오는데 실패했습니다.');
                }
            } catch (error) {
                console.error('홈 정보를 가져오는데 실패했습니다.', error);
            }
        };

        fetchData();
    }, [currentUser]);

    return (
        <div className='frhome'>
            <img className='homeimg' src={homeimg} alt="Homepage" />
            <h6>사진 출처 : 에듀퓨어</h6>

            <div className="home">
                {Frlectures && Frlectures.length > 0 ? (
                    <div style={{display:'flex', flexDirection:'column'}}>

                            <div className="card-container">
                                <h3>사용자 추천 강의</h3>
                                {Frlectures.map((homelist) => (
                                    <div className="card" key={homelist.flectureId}>
                                        <img className="card-image" src={homelist.flectureImage} alt="Course" />
                                        <div className="card-content">
                                            <h2 className="card-title">{homelist.ftitle}</h2>
                                            {homelist.fdescription ? (
                                                <p className="card-description">{homelist.fdescription}</p>
                                            ) : null}
                                            <p>평점 : {homelist.freviewScore}</p>
                                            <p>리뷰 : {homelist.freviewCount}</p>
                                            <button className="card-button" onClick={() => handleSubmit(homelist.flectureId)}>Learn More</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="card-container">
                                <h3>전체 강의</h3>
                                {lecturelistHome.map((homelist) => (
                                    <div className="card" key={homelist.lectureId}>
                                        <img className="card-image" src={homelist.lectureImage} alt="Course" />
                                        <div className="card-content">
                                            <h2 className="card-title">{homelist.title}</h2>
                                            {homelist.description ? (
                                                <p className="card-description">{homelist.description}</p>
                                            ) : null}
                                            <p>평점 : {homelist.reviewScore}</p>
                                            <p>리뷰 : {homelist.reviewCount}</p>
                                            <button className="card-button" onClick={() => handleSubmit(homelist.lectureId)}>Learn More</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                </div>

                    ) : (
                <div style={{display:'flex', flexDirection:'column'}}>

                        <div className="card-container">
                            <h3>전체 과목</h3>
                            {lecturelistHome.map((homelist) => (
                                <div className="card" key={homelist.lectureId}>
                                    <img className="card-image" src={homelist.lectureImage} alt="Course" />
                                    <div className="card-content">
                                        <h2 className="card-title">{homelist.title}</h2>
                                        {homelist.description ? (
                                            <p className="card-description">{homelist.description}</p>
                                        ) : null}
                                        <p>평점 : {homelist.reviewScore}</p>
                                        <p>리뷰 : {homelist.reviewCount}</p>
                                        <button className="card-button" onClick={() => handleSubmit(homelist.lectureId)}>Learn More</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                </div>

                    )}
            </div>
        </div>
    );
};

export default Home;
