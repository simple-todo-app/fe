import React from 'react';
import '../styles/Header.css';

const Header = (props) => {
  const { email } = props
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(true);
  };

  return (
    <header>
      <div><strong>Task App</strong></div>
      {token && <div className='header-right'><div className='logout-btn' onClick={handleLogout}>Logout</div></div>}
      
    </header>
  )
}

export default Header;