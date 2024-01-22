import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const OnlineStudy = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`app ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{marginTop:'20px'}}>
      
        <div className="sidebar" style={{marginRight:'auto'}}>
          <button className="toggle-button" onClick={toggleSidebar}>
            {isSidebarOpen ? '접기' : '펼치기'}
          </button>
          {isSidebarOpen && (
          <div className="sidebar-content">
            <h2>Sidebar 내용</h2>
            <ul>
              <li><Link to="/">홈</Link></li>
              <li><Link to="/courses">강의 목록</Link></li>
            </ul>
          </div>
      )}

        </div>

      <div className="main-content" style={{marginRight:'150px'}}>
        <div className="video-container">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/VIDEO_ID"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>

        <div className="video-description">
          <h2>동영상 제목</h2>
          <p>
            동영상에 대한 설명이나 추가 정보를 여기에 넣어주세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnlineStudy;
