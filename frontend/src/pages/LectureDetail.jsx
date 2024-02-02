/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.02.01
 * Description : Lectrue Detail
 */
import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
const serverUrl = process.env.REACT_APP_SERVER_URL;

const ReviewForm = ({ handleStarClick, selectedStars, onSubmit }) => {
    return (
      <div>
        <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={onSubmit}>
          <p>점수: {selectedStars} 점</p>
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{ cursor: 'pointer' }}
                onClick={() => handleStarClick(star)}>
                {star <= selectedStars ? '★' : '☆'}
              </span>
            ))}
          </div>
          <label>제목</label>
          <input style={{ width: '300px' }} type='text' name='title' />
  
          <label>내용</label>
          <textarea style={{ width: '300px', height: '300px' }} name='content' />
  
          <button type='submit' style={{ marginTop: '10px', width: '80px' }}>
            리뷰 작성
          </button>
        </form>
      </div>
    );
  };
const LectureDetail = ()=>{
    const [lectureInfo, setLectureInfo] = useState({});
    const [toc, setToc] = useState([]);
    const [board, setBoard] = useState([]);
    const {currentUser} = useContext(AuthContext);
    const [selectedStars, setSelectedStars] = useState(0);
    
    const nav = useNavigate();
    const {lectureID} = useParams();

    useEffect(() => {
      axios.post(`${serverUrl}/lectureDetail`, { LectureID: lectureID })
          .then((response) => {
              const data = response.data;
              if (data.success) {
                  setLectureInfo(data.lectureDetail);
                  setToc(data.toc);
                  setBoard(data.board);
              } else {
                  console.error('강의 정보를 가져오는데 실패했습니다.');
                  alert('강의 정보를 가져오는데 실패했습니다.');
              }
          })
          .catch((error) => {
              console.error('강의 정보를 가져오는데 실패했습니다.', error);
          });
    }, []);

    const handleButtonClick = (sectionId) => {
        // 버튼 클릭 시 해당 섹션으로 스크롤
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' , block:'center'});
        }
      };

      const handlesideButtonClick = async() =>{
        if(currentUser && currentUser.length > 0 && currentUser[0].UserID != null){
            const res = await axios.post(`${serverUrl}/lectureDetail/enrollment`,{LectureID: `${lectureID}`,UserID:`${currentUser[0].UserID}` })
            const data = res.data;
            console.log('수강하기 클릭 결과',data);
            if(data.success){
                console.log('찜하기 성공');
                alert('등록 성공\n유료 강의일 경우 결제 후 시청이 가능합니다.');
            }else{
                console.log('찜하기 실패');
                alert('이미 수강등록 중입니다.');
            }
        }else{
            nav('/login');
        }
      }

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

    const handleReviewStarClick = (stars) => {
        setSelectedStars(stars);
      };
    
      const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const title = e.target.title.value.trim();
        const content = e.target.content.value.trim();
        // 간단한 유효성 검사
        if (!title || !content || selectedStars === 0) {
            // 필수 입력값이 비어있으면 경고창을 띄우고 함수 종료
            alert('제목, 내용, 점수는 필수 입력 사항입니다.');
            return;
        }
        const reviewData = {
            LectureID: lectureID,
            UserID: currentUser[0].UserID,
            Title: title,
            Content: content,
            Score: selectedStars,
        };
        try {
          // 서버로 POST 요청 보내기
          const response = await axios.post(`${serverUrl}/lectureDetail/board_upload`, reviewData);
      
          if (response.data.success) {
            console.log('리뷰 저장 성공');
            window.location.reload();
          } else {
            console.error('리뷰 저장 실패');
            alert(response.data.message)
            // 저장 실패에 대한 처리를 여기에 추가할 수 있습니다.
          }
        } catch (error) {
          console.error('리뷰 저장 중 에러 발생', error);
          // 에러 발생에 대한 처리를 여기에 추가할 수 있습니다.
        }
      };
      
    return(
        <div className='app'>
            <div style={{width:'1024px'}}>
                <button type='button' onClick={handlesideButtonClick} style={{marginLeft:'850px',height:'10px' , border:'none', backgroundColor:'transparent'}}>찜하기</button>
                <div className='lectureDetail'>
                    <div className='lectureImage'>
                        <img style={{width:'auto',height:'500px'}} src={lectureInfo.LectureImage}/>
                    </div>
                    <div className='lectureContent'>
                        <div className='contentinner'>
                            <button type='button' onClick={() => handleButtonClick('inslecture')}>강의 소개</button>
                            <button type='button' onClick={() => handleButtonClick('insInstrutor')}>강사 소개</button>
                            <button type='button' onClick={() => handleButtonClick('insToc')}>목차 소개</button>
                            <button type='button' onClick={() => handleButtonClick('review')}>리뷰</button>
                        </div>
                        <div>
                          <h3>{lectureInfo.Title}</h3>
                        </div>
                        <div id='inslecture'>
                            <h3>강의 소개</h3>
                            <p>
                                {lectureInfo.Description ? lectureInfo.Description : '강의 소개가 없습니다.'}
                            </p>
                        </div>
                        <div id='insInstrutor'>
                        <h3>강사 소개</h3>
                            <h3>{lectureInfo.InstructorName}</h3>
                            <p>
                                {lectureInfo.Career}
                            </p>
                        </div>
                        <div id='insToc'>
                        <h3>목차</h3>
                          <ul>
                          {toc.map((toclist)=>(
                            <li key={toclist.TOCID}>{toclist.TITLE}</li>
                          ))}
                          </ul>
                        </div>
                    </div>
                </div>
                <div id='review' style={{ maxHeight: '400px', overflowY: 'auto', border: 'none', padding: '10px', height: '5%'}}>
                {board.ID != null ? board.map((boardlist)=>{
                    return(
                    <div key={boardlist.ID}>
                        <p>
                        익명 {renderStars(boardlist.Score)}<br/>
                        {boardlist.Title}<br/>
                        {boardlist.Content}
                        </p>
                    </div>
                    );
                }) : <div><h4>작성된 리뷰가 없습니다.</h4></div>}
                </div>
                <div>
                <ReviewForm
                    handleStarClick={handleReviewStarClick}
                    selectedStars={selectedStars}
                    onSubmit={handleReviewSubmit}
                />
                </div>
                
            </div>
            <div className='lectureside' >
                <p>{lectureInfo.Title}</p> 
                <p>가격 : {lectureInfo.LecturePay + lectureInfo.Book}</p>
                <p> 교재 유무 : {lectureInfo.Book ? lectureInfo.Book : '없음'}</p>
                <button type='button' onClick={handlesideButtonClick}>수강등록하기</button>
            </div>
        </div>
    );
}

export default LectureDetail;