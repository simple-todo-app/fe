import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Link } from 'react-router-dom';

function App() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const userID = localStorage.getItem('id');

    const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!credentials.email || !credentials.password) {
          setError('Please enter both fields')
        } else {
          axios
            .post('http://localhost:9000/auth/signin', credentials)
            .then((res) => {
                localStorage.setItem('id', res.data.id);
                window.location.reload(true);
            })
            .catch((err) => {
                console.log(err);
            });
        }
        
    };

    useEffect(() => {
        console.log('hey');
        axios
            .get(`http://localhost:9000/tasks/${userID}`)
            .then((res) => {
                setTasks(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [userID]);

    return (
        <div className='App'>
            {userID ? (
                <div>
                    {tasks.map((task) => {
                        return (
                            <div className='task-item' style={task.completed ? { textDecoration: 'underline' } : {}}>
                                {task.title}
                                <input style={{ marginLeft: '20px' }} type='checkbox' />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <form className='auth-form' onSubmit={handleSubmit}>
                    <h1>Sign In</h1>
                    {error && <p>{error}</p>}
                    <input className='auth-input' type='email' value={credentials.email} name='email' onChange={handleChange} placeholder='Email Address' />
                    <input className='auth-input' type='password' value={credentials.password} name='password' onChange={handleChange} placeholder='Password' />
                    <button className='auth-btn'>Sign In</button>
                    <p>New here? <u><Link to='/register'>Create an account.</Link></u></p>
                </form>
            )}
        </div>
    );
}

export default App;
