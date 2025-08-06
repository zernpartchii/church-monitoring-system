import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Axios from 'axios';
import Swal from 'sweetalert2';
function Login() {

    const handleShowPass = () => {
        const passwordInput = document.getElementById('password');
        const eye = document.querySelector('.eye');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eye.textContent = 'visibility_off';
        } else {
            passwordInput.type = 'password';
            eye.textContent = 'visibility';
        }
    };

    const data = {
        username: '',
        password: ''
    }

    const navigate = useNavigate();
    const [formData, setFormData] = useState(data);

    const handleInput = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }))
    };

    const handleLogin = (e) => {
        e.preventDefault();

        Axios.post('http://localhost:5000/api/login', formData)
            .then((response) => {
                // console.log(response.data);
                Swal.fire({
                    icon: response.data.icon,
                    title: response.data.message,
                    text: response.data.text,
                    allowOutsideClick: false, // optional: block clicks outside
                })

                // console.log(response.data.token);
                localStorage.setItem('cmsUserToken', response.data.token);

                if (response.data.icon === 'success') {
                    if (response.data.role === 'super admin') {
                        navigate('/cms/admin/dashboard');
                    } else if (response.data.role === 'admin') {
                        navigate('/cms/dashboard');
                    } else {
                        navigate('/cms/dashboard');
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <div className='vh-100'>
            <div className='center h-100'>
                <form onSubmit={handleLogin} className="card p-3 m-3" style={{ maxWidth: '500px' }}>
                    <div className='card-header bg-transparent'>
                        <h2>Worship Track</h2>
                        <p>Your secure entry to monitor, manage, and serve.</p>
                    </div>
                    <div className='card-body d-flex gap-3 flex-column'>
                        <div>
                            <label htmlFor="username" className="form-label">Username or Email</label>
                            <input type="text" className="form-control" id="username" value={formData.username} onChange={handleInput} required placeholder="Enter your username or email" />
                        </div>
                        <div>
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className='input-group'>
                                <input type="password" className="form-control" id="password" value={formData.password} onChange={handleInput} required placeholder="Enter your password" />
                                <button className="btn btn-light py-0 center btnShowPass" onClick={handleShowPass} type="button">
                                    <span className="material-symbols-outlined eye">
                                        visibility
                                    </span>
                                </button>
                            </div>
                            <button type="button" className="btn btn-link text-decoration-none text-danger">Forgot Password?</button>
                        </div>
                        <div className='d-flex flex-column gap-2'>
                            <button type='submit' className="btn btn-lg btn-success">Login</button>
                            <Link to='/cms/register' className="btn btn-lg btn-outline-secondary">Register</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
