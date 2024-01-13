import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate = useNavigate();
    const [lectrueInfo, setLectureInfo] = useState(null);
    const [categoryInfo, setCategoryInfo] = useState(null);
    useEffect(() => {
        // 컴포넌트가 마운트되면 데이터를 가져옵니다.
        const fetchData = async () => {
        
            try {
                console.log("데이터를 가져오는 중...");
              const response = await fetch("http://localhost:4000/api", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json"
                }
              });
        
              const data = await response.json();
        
              if (data.success) {
                console.log("메인페이지 성공!");
                console.log(data);
                setLectureInfo(data.lecturesList);
                setCategoryInfo(data.categoryList);
    
              } else {
                console.error("메인페이지 실패");
              }
            } catch (error) {
              console.error("오류 발생", error);
            }
          };
        fetchData();
    }, []);

    
    return (
        <div>
            <h1>Home 화면</h1>
            
            {lectrueInfo && (
                <div>
                    <h2>Lecture List</h2>
                    <ul>
                        {lectrueInfo.map((lecture) => (
                            <li key={lecture.id}>
                                <img src={lecture.lectureImage} />
                                {lecture.title}
                                </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Home;
//함수형
// import React, {Component} from 'react';

// class Home extends Component{
//     render(){
//         return <h1>Home 화면</h1>
//     }
// }

// export default Home;
//클래스형