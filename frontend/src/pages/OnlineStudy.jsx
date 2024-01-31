/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.31
 * Description : 
 */

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
const serverUrl = process.env.REACT_APP_SERVER_URL;

const StudyInfo = ({selectedTOC}) =>{

  if (!selectedTOC || selectedTOC.MaterialType === null) {
    return (
      <div className="main-content" style={{ marginRight: '150px' }}>
        <p>선택된 TOC가 null이거나 MaterialType이 null입니다.</p>
      </div>
    );
  }
  return (
      <div className="main-content" style={{marginRight:'150px'}}>
        <div className="video-container">
          <VideoPlayer tocId = {selectedTOC.TOCID} src={`http://localhost:4000/${selectedTOC.MaterialURL}`}/>
        </div>

        <div className="video-description">
          <h2>{selectedTOC.TITLE}</h2>
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

  console.log(lectureID);


  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  
  useEffect(()=>{async function fetchData(){
      const res = await axios.post(`${serverUrl}/lecture_Status`,{LectureID:lectureID});
      if(res.data.success){
        console.log('강의 정보를 성공 적으로 불러왔습니다.');
        console.log(res.data);
        setLecture(res.data.Lecture);
        setLectureM(res.data.LectureM);
        setTOC(res.data.Toc);
        if (res.data.LectureM.length > 0) {
          setSelectedTOC(res.data.LectureM[0]);
        }
  
      }else{
        console.log('정보 가져오기 실패 ㅜㅜ');
        alert('실패 ㅜㅜ');
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
    <div className={`app ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{marginTop:'20px'}}>
      
        <div className="sidebar" style={{marginRight:'auto'}}>
          <button className="toggle-button" onClick={toggleSidebar}>
            {isSidebarOpen ? '접기' : '펼치기'}
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
      <StudyInfo selectedTOC={selectedTOC}/>
    </div>
  );
};

export default OnlineStudy;
