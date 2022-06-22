import React from 'react';

import '../styles/Header.css';

const Header = () => {
  const userID = localStorage.getItem('id');

  const handleLogout = () => {
    localStorage.removeItem('id');
    window.location.reload(true);
  };

  return (
    <header>
      <div>Simple Task App</div>
      {userID && <div className='logout-btn' onClick={handleLogout}>Logout</div>}
      
    </header>
  )
}

export default Header;