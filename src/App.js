import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import './App.css';
import { Link } from 'react-router-dom';

import Header from './components/Header';

function App() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [newTodo, setNewTodo] = useState('');
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    
    let id = null;
    let email = null;

    const token = localStorage.getItem('token');
    const decode = jwt_decode(token);

    if (id === null && token) {
        email = decode.email;
        id = decode.id;
    }

    const getTasks = () => {
        if (id !== null) {
            axios
            .get(`https://dylan-todo-app-be.herokuapp.com/tasks/${id}`, { headers: { Authorization: token } })
            .then((res) => {
                setTasks(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
        }  
    };

    const handleChanges = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value })
      setError('')
    };
    
    const handleNewTodo = (e) => setNewTodo(e.target.value);

    const handleAddTodo = (e) => {
        e.preventDefault();
        if (newTodo) {
            axios
                .post('https://dylan-todo-app-be.herokuapp.com/tasks', { title: newTodo, user_id: id }, { headers: { Authorization: token } })
                .then(() => {
                    getTasks();
                    setNewTodo('');
                })
                .catch((err) => console.log(err));
        }
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        if (!credentials.email || !credentials.password) {
            setError('Please enter both fields');
        } else {
            axios
                .post('https://dylan-todo-app-be.herokuapp.com/auth/signin', credentials)
                .then((res) => {
                    localStorage.setItem('token', res.data.token);
                    window.location.reload(true);
                })
                .catch((err) => {
                    setError(err.response.data.message);
                });
        }
    };

    const handleDelete = (task_id) => {
        axios
            .delete(`https://dylan-todo-app-be.herokuapp.com/tasks/${task_id}`, { headers: { Authorization: token } })
            .then(() => {
                getTasks();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleCompleted = (task_id, completed) => {
        axios.put(`https://dylan-todo-app-be.herokuapp.com/tasks/${task_id}`, { completed: !completed })
             .then(() => {
                 getTasks();
             })
             .catch((err) => {
                 console.log(err);
             });
    };

    useEffect(() => {
        getTasks();
    }, [id]);

    return (
        <div className='App'>
            <Header email={email} />
            {localStorage.getItem('token') ? (
                <div className='wrapper'>
                    <h1>Tasks</h1>
                    <form className='task-form' onSubmit={handleAddTodo}>
                        <input className='task-input' type='text' placeholder='New task' value={newTodo} onChange={handleNewTodo} />
                        <button className='task-btn'>Add</button>
                    </form>
                    <div className='tasks-header'>
                        <div className='tasks-header-left'>To Do</div>
                        <div className='tasks-header-right'>
                            {tasks.filter((task) => !task.completed).length}
                            {tasks.filter((task) => !task.completed).length === 1 ? ' Item' : ' Items'}
                        </div>
                    </div>
                    {tasks
                        .filter((task) => !task.completed)
                        .map((task, index) => {
                            return (
                                <div key={index} className='task-item'>
                                    <div className='task-text-wrapper'>
                                        <input style={{ marginRight: '20px' }} type='checkbox' checked={task.completed} onChange={() => handleCompleted(task.task_id, task.completed)} />
                                        <div className={task.completed ? 'completed' : ''}>{task.title}</div>
                                    </div>
                                    <button onClick={() => handleDelete(task.task_id)}>Delete</button>
                                </div>
                            );
                        })}
                    <div className='tasks-header' style={tasks.filter((task) => task.completed).length > 0 ? { display: 'flex' } : { display: 'none' }}>
                        <div className='tasks-header-left'>Completed</div>
                        <div className='tasks-header-right'>
                            {tasks.filter((task) => task.completed).length}
                            {tasks.filter((task) => task.completed).length === 1 ? ' Item' : ' Items'}
                        </div>
                    </div>
                    {tasks
                        .filter((task) => task.completed)
                        .map((task, index) => {
                            return (
                                <div key={index} className='task-item'>
                                    <div className='task-text-wrapper'>
                                        <input style={{ marginRight: '20px' }} type='checkbox' checked={task.completed} onChange={() => handleCompleted(task.task_id, task.completed)} />
                                        <div className={task.completed ? 'completed' : ''}>{task.title}</div>
                                    </div>
                                    <button onClick={() => handleDelete(task.task_id)}>Delete</button>
                                </div>
                            );
                        })}
                </div>
            ) : (
                <form className='auth-form' onSubmit={handleSignIn}>
                    <h1>Sign In</h1>
                    {error && <p>{error}</p>}
                    <input className='auth-input' type='email' value={credentials.email} name='email' onChange={handleChanges} placeholder='Email Address' />
                    <input className='auth-input' type='password' value={credentials.password} name='password' onChange={handleChanges} placeholder='Password' />
                    <button className='auth-btn'>Sign In</button>
                    <p>
                        New here?{' '}
                        <u>
                            <Link to='/register'>Create an account.</Link>
                        </u>
                    </p>
                </form>
            )}
        </div>
    );
}

export default App;
