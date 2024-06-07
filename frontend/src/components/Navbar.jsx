/**
 * Author : woo
 * Date : 24.01.15
 * Last : 24.02.17
 * Description : Nav
 */

import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import mainlogo from '../img/JIKCOlOGO.png';
import { AuthContext} from '../context/AuthContext';
import defaultimage from '../img/DefaultImage.png';
import on from '../img/onoff_on3.png';
import off from '../img/onoff_off3.png';


const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const nav = useNavigate();
  const { currentUser,logout, checkTokenValidity } = useContext(AuthContext);
  const location = useLocation();


  const handleLogout = () =>{
    logout();
    nav('/login');
  }

  const handleSearchSubmit = () => {
    if (!searchTerm) {
        return;
    }
    nav(`/search/${searchTerm}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };
  useEffect(() => {
    const checkToken = async () => {
      const result = await checkTokenValidity();
      if (result) {
        console.log('토큰 유효');
      }else{
        handleLogout();
      }
    };
    console.log('navBar');
    if(currentUser !== null){
      checkToken();
    }
  }, [location.pathname]);

  return (
    
    <div className="navbar">
      <div className="container" style={{ height: '100px',borderBottom: '5px solid #007bff'}}>
        <div className="logo">
          <Link className="link" to={'/'}>
            <img style={{ marginBottom: '30px', width: '150px' }} src={mainlogo} alt='' />
          </Link>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div className="search-container">
            <div style={{ display: 'flex' }}>
              <input
                style={{ width: '450px' }}
                type="text"
                id="search-bar"
                placeholder="Category 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="submit"
                style={{ padding: '5px', background: 'none', border: 'none' }}
                onClick={handleSearchSubmit}
              >
                <img
                  className="search-icon"
                  src="http://www.endlessicons.com/wp-content/uploads/2012/12/search-icon.png"
                  alt="Search"
                  style={{ width: '25px', height: '25px' }}
                />
              </button>
            </div>
          </div>
        </div>
        <div style={{width:'20%'}}>
        {currentUser ? 
        <div className="links">
          <Link className="link" to="#" onClick={handleLogout}>
          <img style={{width:'50px',height:'10%', borderRadius:'40%',boxShadow: '0px 0px 20px rgba(0, 255, 0, 0.5)'}} 
              src={on} alt='state : login'/>
          </Link>
          <Link className="link" to='/profile'>
            {currentUser[0].UserName}
          </Link>
          <Link className="link" to='/profile'>
          <img style={{width:'50px',height:'10%', borderRadius:'100%', boxShadow:'0px 0px 20px  rgba(0, 0, 0, 0.3)'}} 
              src={currentUser[0].UserImage != null ? `http://localhost:4000/${currentUser[0].UserImage}` : defaultimage} alt=''/>
          </Link>

        </div> :
          <div className="links">
          <Link className="link" to="/login">
          <img style={{width:'50px',height:'10%', borderRadius:'40%',boxShadow:'0px 0px 20px  rgba(100, 0, 0, 0.3)'}} 
              src={off} alt='state : logout'/>
          </Link>
          <Link className="link" to="/register">
            <h6>회원가입</h6>
          </Link>
        </div>
      }
      </div>
        
      </div>
    </div>
  );
};

export default Navbar;
