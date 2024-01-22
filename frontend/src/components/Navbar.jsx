import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import mainlogo from '../img/Jikcologo.png';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const nav = useNavigate();

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

  return (
    <div className="navbar">
      <div className="container" style={{ height: '100px' }}>
        <div className="logo">
          <Link className="link" to={'/'}>
            <img style={{ marginBottom: '30px', width: '150px' }} src={mainlogo} />
          </Link>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div className="search-container">
            <div style={{ display: 'flex' }}>
              <input
                style={{ width: '450px' }}
                type="text"
                id="search-bar"
                placeholder="검색"
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

        <div className="links">
          <Link className="link" to="/login">
            <h6>로그인</h6>
          </Link>
          <Link className="link" to="/register">
            <h6>회원가입</h6>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
