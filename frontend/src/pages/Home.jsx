/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.05.23
 * Description : Main Home Page
 * Modified : Image Change
 */
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import homeimg from '../img/Jikcoimg.jpg';
import homeimg2 from '../img/lake-7624330_1280.jpg';
import homeimg3 from '../img/snake-7716269_1280.jpg';
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

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const homeImages = [
        homeimg,
        homeimg2,
        homeimg3
    ];

    const [ImageChanger, setCurrentImage] = useState([
        homeimg,
        homeimg2,
        homeimg3
    ]);

    console.log('home ',lecturelistHome);

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
                    console.log('홈 정보를 가져오는데 실패했습니다.');
                }
            } catch (error) {
                console.log('홈 정보를 가져오는데 실패했습니다.', error);
            }
        };

        fetchData();

        const interval = setInterval(() => {
                    // 이미지 인덱스를 변경하여 다음 이미지를 보여줍니다.
                    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % homeImages.length);
                }, 5000);
        
        return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 interval 정리
    }, [currentUser]);
    // 5초마다 이미지 변경
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         // 이미지 인덱스를 변경하여 다음 이미지를 보여줍니다.
    //         setCurrentImageIndex((prevIndex) => (prevIndex + 1) % homeImages.length);
    //     }, 5000);

    //     return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 interval 정리
    // }, []); // 빈 배열을 전달하여 최초 렌더링 시에만 실행되도록 설정
  
    const renderStars = (score) => {
        const maxStars = 5;
        const filledStars = Math.round(score); // 반올림하여 꽉 찬 별 갯수 계산
    
        const stars = [];
        for (let i = 1; i <= maxStars; i++) {
            if (i <= filledStars) {
                stars.push(<span key={i}>&#9733;</span>); // 별이 채워진 경우
            } else {
                stars.push(<span key={i}>&#9734;</span>); // 빈 별
            }
        }
    
        return stars;
    };
    const maxLength = 50; // 원하는 최대 길이
    return (
        <div className='frhome' style={{marginTop:'10px', width:'1024px'}}>
            {/* <img className='homeimg' src={homeimg} alt="Homepage" /> */}
            <img className='homeimg' src={homeImages[currentImageIndex]} alt="Homepage" />
            <h6 style={{marginLeft: '14px'}}>사진 출처 : 에듀퓨어</h6>

            <div className="home">
                {Frlectures && Frlectures.length > 0 ? (
                    <div style={{display:'flex', flexDirection:'column'}}>
                                <h3 style={{marginLeft: '14px'}}>사용자 추천 강의</h3>
                            <div className="card-container" style={{maxHeight: '600px', overflowY: 'auto', borderBottom:'5px solid'}}>
                                {Frlectures.map((homelist) => (
                                    <div className="card" key={homelist.flectureId}>
                                        <img className="card-image" src={homelist.flectureImage} alt="Course" />
                                        <div className="card-content" >
                                            <h2 className="card-title">{homelist.ftitle}</h2>
                                            {homelist.fdescription ? (
                                                <p className="card-description">
                                                    {homelist.fdescription.length > maxLength ? `${homelist.fdescription.slice(0, maxLength)}...` : homelist.description}
                                                </p>
                                            ) : null}
                                            <p>평점 : {renderStars(homelist.freviewScore)} {homelist.freviewScore}</p>
                                            <p>리뷰 : {homelist.freviewCount}</p>
                                            
                                        </div>
                                        <button className="card-button" 
                                            onClick={() => handleSubmit(homelist.flectureId)}
                                            >Learn More</button>
                                    </div>
                                ))}
                            </div>
                            <h3 style={{marginLeft: '14px'}}>전체 강의</h3>
                            <div className="card-container" style={{maxHeight: '600px', overflowY: 'auto', marginTop:'20px', borderTop: '5px solid'}}>
                                {lecturelistHome.map((homelist) => (
                                    <div className="card" key={homelist.lectureId}>
                                        <img className="card-image" src={homelist.lectureImage} alt="Course" />
                                        <div className="card-content" >
                                            <h2 className="card-title">{homelist.title}</h2>
                                            {homelist.description ? (
                                                <p className="card-description">
                                                    {homelist.description.length > maxLength ? `${homelist.description.slice(0, maxLength)}...` : homelist.description}
                                                </p>
                                            ) : null}
                                            <p>평점 : {renderStars(homelist.reviewScore)} {homelist.reviewScore}</p>
                                            <p>리뷰 : {homelist.reviewCount}</p>
                                            
                                        </div>
                                        <button className="card-button" 
                                            onClick={() => handleSubmit(homelist.lectureId)}
                                            >Learn More</button>
                                    </div>
                                ))}
                            </div>
                </div>

                    ) : (
                <div style={{display:'flex', flexDirection:'column'}}>
                            <h3 style={{marginLeft: '14px'}}>전체 과목</h3>
                        <div className="card-container" style={{maxHeight: '600px', overflowY: 'auto'}}>
                            {lecturelistHome.map((homelist) => (
                                <div className="card" key={homelist.lectureId}>
                                    <img className="card-image" src={homelist.lectureImage} alt="Course" />
                                    <div className="card-content">
                                        <h2 className="card-title">{homelist.title}</h2>
                                        {homelist.description ? (
                                            <p className="card-description">
                                                {homelist.description.length > maxLength ? `${homelist.description.slice(0, maxLength)}...` : homelist.description}</p>
                                        ) : null}
                                        <p>평점 : {renderStars(homelist.reviewScore)} {homelist.reviewScore}</p>
                                        <p>리뷰 : {homelist.reviewCount}</p>
                                    </div>
                                    <button className="card-button" 
                                        onClick={() => handleSubmit(homelist.lectureId)}
                                        >Learn More</button>
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