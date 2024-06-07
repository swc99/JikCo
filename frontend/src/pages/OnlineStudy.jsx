/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.02.13
 * Description : 
 */

import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import { AuthContext } from '../context/AuthContext';
const serverUrl = process.env.REACT_APP_SERVER_URL;

const StudyInfo = ({selectedTOC,lectureId}) =>{
 
  if (!selectedTOC || selectedTOC.MaterialType === null) {
    return (
      <div className="main-content" style={{ marginRight: '150px' }}>
        <p>선택된 TOC가 null이거나 MaterialType이 null입니다.</p>
      </div>
    );
  }
  return (
      <div className="main-content" style={{marginRight:'150px' ,width:'90%'}}>
        <div className="video-container">
        <h2>{selectedTOC.TITLE}</h2>
          <VideoPlayer tocId = {selectedTOC.TOCID} lectureID={lectureId} src={`http://localhost:4000/${selectedTOC.MaterialURL}`}/>
        </div>
        <div className="video-description">
          <p>
            {selectedTOC.Description}
          </p>
        </div>
      </div>
  );
}

const OnlineStudy = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const {lectureID} = useParams();
  const [lecture, setLecture] = useState([]);
  const [lectureM, setLectureM] = useState([]);
  const [Toc, setTOC] = useState([]);
  const [selectedTOC, setSelectedTOC] = useState(null);
  const {currentUser} = useContext(AuthContext);


  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  
  useEffect(()=>{
    const fetchData = async () => {
      console.log('서버로 보낼 데이터 : ',lectureID,'  ',currentUser[0].UserID);

      const res = await axios.post(`${serverUrl}/lecture_Status`,{LectureID:lectureID});
        if(res.data.success){
          console.log('강의 정보를 성공 적으로 불러왔습니다.');
          console.log(res.data);
          setLecture(res.data.Lecture);
          setLectureM(res.data.LectureM);
          setTOC(res.data.Toc);
          
    
        }else{
          console.log('정보 가져오기 실패 ㅜㅜ');
          alert('실패 ㅜㅜ');
        }
      const response = await axios.post(`${serverUrl}/keep`,{
        LectureID: lectureID,
        UserID: currentUser[0].UserID
      });
      if(response.data.success){
        console.log('이어보기 결과',response.data.message);
        const keepTOC = response.data.KeepToc;
        const lastestTOC = keepTOC.reduce((latest, current) => {
          if (!latest || current.LastAccessed > latest.LastAccessed) {
              return current;
          } else {
              return latest;
          }
        }, null);
        console.log('last toc',lastestTOC);
      
        if (res.data.LectureM.length > 0) {
          const lastIndex = res.data.LectureM.find((toc) => toc.TOCID === lastestTOC.TOCID);
          setSelectedTOC(lastIndex);
          console.log(lastIndex);
        }
      }else{
        const nonNullParentTOC = res.data.LectureM.find(toc => toc.ParentTOC !== null);
        if (res.data.LectureM.length > 0) {
          setSelectedTOC(nonNullParentTOC);
        }
      }
    }
    fetchData();
  },[])
  const handleClickTOC = (TOCID) => {
    const selectedTOC = lectureM.find((toc) => toc.TOCID === TOCID);
    if (selectedTOC) {
      setSelectedTOC(selectedTOC);
    }
  }
  return (
    <div className={`app ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{marginTop:'20px', width:'1024px'}}>
      
        <div className="sidebar" style={{marginRight:'auto'}}>
          <button className="toggle-button" onClick={toggleSidebar}>
            {isSidebarOpen ? '접기' : '목차 열기'}
          </button>
          {isSidebarOpen && (
          <div className="sidebar-content" style={{maxHeight: '600px', overflowY: 'auto'}}>
            <h2>{lecture.Title}</h2>
            {Toc && Toc.map((toc)=>(
              <div  key={toc.TOCID}>
                {toc.ParentTOC === null && <h4>{toc.TITLE}</h4>}
                {toc.ParentTOC !== null && <ul><li onClick={()=>handleClickTOC(toc.TOCID)}>{toc.TITLE}</li></ul>}
              </div>
              ))}
          </div>
      )}
        </div>
      <StudyInfo selectedTOC={selectedTOC} lectureId={lectureID}/>
    </div>
  );
};

export default OnlineStudy;