import React, { useContext, useEffect, useRef, useState } from 'react';
import './VideoPlayer.css';
import ProgressBar from '../ProgressBar';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
const serverUrl = process.env.REACT_APP_SERVER_URL;

function VideoPlayer({ src, tocId }) {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const {currentUser} = useContext(AuthContext);

  const playVideo = () => {
    videoRef.current.play();
  };

  const pauseVideo = () => {
    videoRef.current.pause();
  };

  const fastForward = () => {
    videoRef.current.currentTime += 10;
  };

  const rewind = () => {
    videoRef.current.currentTime -= 10;
  };

  useEffect(() => {
    const video = videoRef.current;

    const timeUpdateHandler = () => {
      setCurrentTime(video.currentTime);
    };

    const loadedMetadataHandler = () => {
      setDuration(video.duration);
    };

    const sendProgressToServer = async () => {
      const currentTime = video.currentTime;
      console.log(`Sending progress to server: ${currentTime}`);
      const res = await axios.post(`${serverUrl}/lectureDetail/tocInfoSet`,{TOCID : tocId, UserID : currentUser[0].UserID, Progress: currentTime});
      console.log('woo',res.data);
      if(res.data.success){
        console.log(res.data.message);
      }else{
        alert(res.data.message);
      }
    };

    // 30초마다 함수를 호출
    const intervalId = setInterval(sendProgressToServer, 30000);

    // 비디오가 끝났을 때
    const handleVideoEnd = () => {
        console.log('영상 끝!',currentTime);

        clearInterval(intervalId);
        video.removeEventListener('timeupdate', timeUpdateHandler);
    };

    video.addEventListener('timeupdate', timeUpdateHandler);
    video.addEventListener('loadedmetadata', loadedMetadataHandler);
    video.addEventListener('ended', handleVideoEnd);

    return () => {
      clearInterval(intervalId);
      video.removeEventListener('timeupdate', timeUpdateHandler);
      video.removeEventListener('loadedmetadata', loadedMetadataHandler);
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, []);

  return (
    <div className="video-container">
      <video className="video-player" ref={videoRef} src={src}></video>

      <div className="controls">
        <button className="control-button" onClick={playVideo}>
          Play
        </button>

        <button className="control-button" onClick={pauseVideo}>
          Pause
        </button>

        <button className="control-button" onClick={rewind}>
          Rewind
        </button>

        <button className="control-button" onClick={fastForward}>
          Fast Forward
        </button>
      </div>

      <div >
        <div className="progress-bar" style={{display:'flex',flexDirection:'column'}}>
          <ProgressBar progress={Number((currentTime / duration * 100).toFixed(0))} />

          <div className="time-indicator" style={{display:'flex', flexDirection:'row'}}>
            <span className="current-time">{currentTime.toFixed(1)}</span>
            <span className="duration"  style={{marginLeft:'auto'}}>{duration.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
