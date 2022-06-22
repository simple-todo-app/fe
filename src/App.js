import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Link } from 'react-router-dom';

import Header from './components/Header';

function App() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [newTodo, setNewTodo] = useState('')
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const userID = localStorage.getItem('id');

    const getTasks = () => {
      axios
            .get(`http://localhost:9000/tasks/${userID}`)
            .then((res) => {
                setTasks(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const handleChanges = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });
    const handleNewTodo = (e) => setNewTodo(e.target.value)
  
    const handleAddTodo = (e) => {
      e.preventDefault();
      if (newTodo) {
        axios
          .post('http://localhost:9000/tasks', { title: newTodo, user_id: userID })
          .then(() => {
              getTasks()
              setNewTodo('')
              setError('')
          }).catch(err => console.log(err))
      }
    }

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

    const handleDelete = (task_id) => {
      axios.delete(`http://localhost:9000/tasks/${task_id}`)
        .then(() => {
          getTasks()
        }).catch(err => {
          console.log(err)
        })
    }

    useEffect(() => {
      getTasks()
    }, [userID]);

    return (
        <div className='App'>
          <Header />
            {userID ? (
                <div className='wrapper'>
                  <h1>To do</h1>
                  <form className='task-form' onSubmit={handleAddTodo}>
                    <input className='task-input' type='text' placeholder='Enter task' value={newTodo} onChange={handleNewTodo} />
                    <button className='task-btn'>Add</button>
                    
                  </form>
                    {tasks.map((task, index) => {
                        return (
                            <div key={index} className='task-item' >
                              <div className='task-text-wrapper'>
                              <input style={{ marginRight: '20px' }} type='checkbox' />
                                <div className={task.completed ? 'completed' : ''}>
                                  {task.title}
                                </div>
                                </div>
                                <button onClick={() => handleDelete(task.task_id)}>Delete</button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <form className='auth-form' onSubmit={handleSubmit}>
                    <h1>Sign In</h1>
                    {error && <p>{error}</p>}
                    <input className='auth-input' type='email' value={credentials.email} name='email' onChange={handleChanges} placeholder='Email Address' />
                    <input className='auth-input' type='password' value={credentials.password} name='password' onChange={handleChanges} placeholder='Password' />
                    <button className='auth-btn'>Sign In</button>
                    <p>New here? <u><Link to='/register'>Create an account.</Link></u></p>
                </form>
            )}
        </div>
    );
}

export default App;
