import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Axios from 'axios';
import Swal from 'sweetalert2';
import '../css/login.css';
import Header from './Header';
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
        <div className='vh-100 loginBody'>
            <div className='center'>
                <Header />
                <div className='center shadow-lg flex-wrap loginForm mx-3' style={{ width: '900px' }}>
                    <div className='flex-fill center loginLogo'>
                        <img className='m-0' height={340} src="../cca.png" alt="Christ Centered Assembly" />
                    </div>
                    <form onSubmit={handleLogin} className="card p-3 border-0 bg-transparent text-white">
                        <div className='card-header bg-transparent border-white'>
                            <h3>Welcome to CCA Monitoring System</h3>
                            <p>Securely access your tools to monitor, manage, and <br /> serve in the Christ-Centered Assembly.</p>
                        </div>
                        <div className='card-body d-flex flex-column'>
                            <div className='flex-fill mb-3'>
                                <label htmlFor="username" className="form-label">Username or Email</label>
                                <input type="text" className="form-control" id="username" value={formData.username}
                                    onChange={handleInput} required placeholder="Enter your username or email" />
                            </div>
                            <div className='flex-fill'>
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className='input-group'>
                                    <input type="password" className="form-control" id="password" value={formData.password}
                                        onChange={handleInput} required placeholder="Enter your password" />
                                    <button className="btn btn-light py-0 center border btnShowPass" onClick={handleShowPass} type="button">
                                        <span className="material-symbols-outlined eye">
                                            visibility
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className='text-end mb-3'>
                                <button type="button" className="btn btn-link text-decoration-none text-warning">Forgot Password?</button>
                            </div>
                            <div className='d-flex flex-column text-center gap-3'>
                                <button type='submit' className="btn btn-success">Login</button>
                                <p>Don't have an account? <Link to="/cms/register"
                                    className="text-decoration-none text-dark badge bg-warning">Register</Link></p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
}

export default Login
