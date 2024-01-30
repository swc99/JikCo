/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.01.30
 * Description : Progress Bar
 */
import React,{useState, useEffect, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
const serverUrl = process.env.REACT_APP_SERVER_URL;



const ProgressBar = ({ progress }) => {

    return (
      <div style={{ height:'20%', width: 'auto', border: '1px solid #ccc', borderRadius: '5px', overflow: 'hidden', marginTop: '10px' }}>
        <div
          style={{
            width: `${progress}%`,
            height: '20px',
            backgroundColor: '#4CAF50',
            textAlign: 'center',
            color: 'white',
            lineHeight: '20px',
          }}
        >
          {`${progress}%`}
        </div>
      </div>
    );
};

export default ProgressBar;