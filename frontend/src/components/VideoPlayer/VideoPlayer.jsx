/**
 * Update User : woo
 * Last : 24.02.01
 * Description : Video Player
 */

import React, { useContext, useEffect, useRef, useState } from 'react';
import './VideoPlayer.css';
import ProgressBar from '../ProgressBar';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
const serverUrl = process.env.REACT_APP_SERVER_URL;

const VideoPlayer = ({ src, tocId,lectureID }) => {

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
  const restartVideo = () => {
    videoRef.current.currentTime = 0;
    setCurrentTime(0);
  };
  
  const soundControll = (e) => {
    const volume = e.target.value;
    if(videoRef.current){
      videoRef.current.volume = volume;
    }
  }
  useEffect(() => {
    // console.log(src);
    // console.log(tocId);
    setCurrentTime(0);
    const video = videoRef.current;
    let playIntervalId;
  
    const timeUpdateHandler = () => {
      setCurrentTime(video.currentTime);
    };
  
    const loadedMetadataHandler = () => {
      setDuration(video.duration);
    };
  
    const sendProgressToServer = async () => {
      const currentTime = videoRef.current.currentTime;
      console.log(`Sending progress to server: ${currentTime}`);
      const res = await axios.post(`${serverUrl}/lectureDetail/tocInfoSet`, {
        TOCID: tocId,
        UserID: currentUser[0].UserID,
        LectureID: lectureID,
        Progress: currentTime
      });
      // console.log('woo', res.data);
      if (res.data.success) {
        console.log(res.data.message);
      } else {
        alert(res.data.message);
      }
    };
  
    const handleVideoEnd = () => {
      setCurrentTime(video.duration);

      alert(`영상 끝! - ${video.duration}`);

      clearInterval(playIntervalId);
      video.removeEventListener('timeupdate', timeUpdateHandler);

      sendProgressToServer();
    };
  
    const handlePlayButtonClick = () => {
      playIntervalId = setInterval(() => {
        sendProgressToServer();
      }, 20000);
      video.addEventListener('timeupdate', timeUpdateHandler);
      video.addEventListener('ended', handleVideoEnd);
    };
    video.addEventListener('play', handlePlayButtonClick);
    video.addEventListener('loadedmetadata', loadedMetadataHandler);
    
    return () => {
      clearInterval(playIntervalId);
      video.removeEventListener('timeupdate', timeUpdateHandler);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('play', handlePlayButtonClick);
      video.removeEventListener('loadedmetadata', loadedMetadataHandler);
    };
  }, [tocId]);
  
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

        <button className="control-button" onClick={restartVideo}>
          ReStart
        </button>
        <input id='volume' type='range' min='0' max='1' step='0.01' onChange={soundControll}/>
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
