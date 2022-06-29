import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Header from '../components/Header';

const Register = () => {

  const handleSubmit = (e) => {
    e.preventDefault();
    // axios.post('')
  }
  
  return (
    <div className='App'>
      <Header />
      <form className='auth-form' onSubmit={handleSubmit}>
        <h1>Register</h1>
        <input className='auth-input' type='email' placeholder='Email Address' />
        <input className='auth-input' type='password' placeholder='Password' />
        <button className='auth-btn'>Register</button>
        <p>Been here before? <u><Link to='/'>Sign In.</Link></u></p>
      </form>
    </div>
  )
}

export default Register;