/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.17
 * Description : Lectrue Detail
 */
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import lectureimg from '../img/Jikcoimg.jpg'
const serverUrl = process.env.REACT_APP_SERVER_URL;


const LectureDetail = ()=>{
    const [lectureInfo, setLectureInfo] = useState([]);
    const [toc, setToc] = useState([]);
    const [board, setBoard] = useState([]);
    
    const {selectID} = useParams();

    useEffect(() => {
        fetch(`${serverUrl}/lectureDetail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // 요청 데이터 타입 설정
          },
          body: JSON.stringify({
            LectureID : selectID
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              setLectureInfo(data.lectureDetail);
              setToc(data.toc);
              setBoard(data.board);
            } else {
              console.error('강의 정보를 가져오는데 실패했습니다.');
            }
          })
          .catch((error) => {
            console.error('강의 정보를 가져오는데 실패했습니다.', error);
          });
      }, []);
      

    // const StarRating = ({ star }) => {
    //     const renderStars = () => {
    //       const stars = [];
    //       for (let i = 1; i <= 5; i++) {
    //         const starClass = i <= star ? "star-filled" : "star-empty";
    //         const starCharacter = i <= star ? "★" : "☆";
    //         stars.push(
    //           <span key={i} className={`star ${starClass}`}>
    //             {starCharacter}
    //           </span>
    //         );
    //       }
    //       return stars;
    //     };
    // }
    return(
        <div className='app'>
            <div>
                
                <h6 style={{marginLeft:'850px',height:'10px'}}>찜하기</h6>
                <div className='lectureDetail'>
                    <div className='lectureImage'>
                        <img style={{width:'auto',height:'500px'}} src={lectureimg}/>
                    </div>
                    <div className='lectureContent'>
                        <div className='contentinner'>
                            <button>강의 소개</button>
                            <button>강사 소개</button>
                            <button>목차 소개</button>
                        </div>
                        <div>{lectureInfo.Title}</div>
                        <div>
                            <ul>
                                <li>강의 소개</li>
                            </ul>
                            <p>
                                {lectureInfo.Description ? lectureInfo.Description : '강의 소개가 없습니다.'}
                            </p>
                        </div>
                        <div>
                            <ul>
                                <li>강사 소개</li>
                            </ul>
                            <h3>{lectureInfo.InstructorName}</h3>
                            <p>
                                {lectureInfo.Career}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <form  style={{display:'flex', flexDirection:'column'}}>
                        <p>점수</p>
                        <label>제목</label>
                        <input style={{width:'300px'}} type='text' name='title'/>
                        
                        <label>내용</label>
                        <textarea style={{width:'300px',height:'300px'}} type='text' name='title'/>

                        <button type='submit' style={{marginTop:'10px', width:'80px'}}>리뷰 작성</button>
                    </form>
                </div>
                
            </div>
            <div className='lectureside' >
                <p>
                    강의 제목 , 강의 가격, 교재 유무
                </p>
                <button>수강하기</button>
            </div>
        </div>
    );
}

export default LectureDetail;