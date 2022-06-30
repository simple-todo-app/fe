import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import Header from '../components/Header';

const Register = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    let navigateTo = useNavigate();

    const handleChanges = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError('');
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (!credentials.email) {
            setError('Please enter your email address');
        } else if (!credentials.password) {
            setError('Please enter a password');
        } else {
            axios
                .post('https://dylan-todo-app-be.herokuapp.com/auth/register', credentials)
                .then(() => {
                    axios
                        .post('https://dylan-todo-app-be.herokuapp.com/auth/signin', credentials)
                        .then((res) => {
                            localStorage.setItem('token', res.data.token);
                            navigateTo('../');
                        })
                        .catch((err) => {
                            setError(err.response.data.message);
                        });
                })
                .catch((err) => {
                    setError(err.response.data.message);
                });
        }
    };

    return (
        <div className='App'>
            <Header />
            <form className='auth-form' onSubmit={handleRegister}>
                <h1>Register</h1>
                {error && <p>{error}</p>}
                <input className='auth-input' type='email' value={credentials.email} name='email' onChange={handleChanges} placeholder='Email Address' />
                <input className='auth-input' type='password' value={credentials.password} name='password' onChange={handleChanges} placeholder='Password' />
                <button className='auth-btn'>Register</button>
                <p>
                    Been here before?{' '}
                    <u>
                        <Link to='/'>Sign In.</Link>
                    </u>
                </p>
            </form>
        </div>
    );
};

export default Register;
