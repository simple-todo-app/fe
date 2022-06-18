import React, { useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';

function App() {
  const [tasks, setTasks] useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
  }


  return (
    <div className="App">
      <form className='auth-form' onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <input className='auth-input' type='email' placeholder='Email Address' />
        <input className='auth-input' type='password' placeholder='Password' />
        <button className='auth-btn'>Sign In</button>
        <p>New here? <u><Link to='/register'>Create an account.</Link></u></p>
      </form>
    </div>
  );
}

export default App;
