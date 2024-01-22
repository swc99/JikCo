/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.17
 * Description : Main Home Page
 */
import React,{useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import homeimg from '../img/Jikcoimg.jpg';
const serverUrl = process.env.REACT_APP_SERVER_URL;

const Home = () => {
    const nav = useNavigate();
    const [lecturelistHome, setMainHome ] = useState([]);
    const [categorylist, setCategory ] = useState([]);

    const handleSubmit = (lecturID)=>{

        nav(`/lectureDetail/${lecturID}`);
    }

    useEffect(()=>{
        fetch(`${serverUrl}/`)
            .then((response) => response.json())
            .then((data)=>{
                if (data.success) {
                    console.log(data.lecturesList);
                    setMainHome(data.lecturesList);
                    setCategory(data.categoryList);
                } else {
                    console.error('홈 정보를 가져오는데 실패했습니다.');
                }
            })
            .catch((error) => {
                console.error('홈 정보를 가져오는데 실패했습니다.', error);
            });
    },[]);


    return (
        <div className='frhome'>
            <img className='homeimg' src={homeimg}/>
            <h6>사진 출처 : 에듀퓨어</h6>

            <div className="home">

                <div className="card-container">
                    
                    {lecturelistHome.map((homelist)=>{
                        return(
                            <div className="card" key={homelist.lectureId}>
                        <img className="card-image" src={homelist.lectureImage} alt="Course Image" />
                        <div className="card-content">
                            <h2 className="card-title">{homelist.title}</h2>
                            {homelist.description ? (
                                <p className="card-description">{homelist.description}</p>
                            ) : null}
                            <p>리뷰 : {homelist.reviewCount} 평점: {homelist.reviewScore}</p>
                            <button className="card-button" onClick={() => handleSubmit(homelist.lectureId)}>Learn More</button>
                        </div>
                    </div>
                        );
                    })}

                </div>

            </div>
        </div>
    );
}

export default Home;
