import React from 'react'
import { Link } from 'react-router-dom'
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

    return (
        <div className='vh-100'>
            <div className='center h-100'>
                <form className="card p-3 m-3" style={{ maxWidth: '500px' }}>
                    <div className='card-header bg-transparent'>
                        <h2>Worship Track</h2>
                        <p>Your secure entry to monitor, manage, and serve.</p>
                    </div>
                    <div className='card-body d-flex gap-3 flex-column'>
                        <div>
                            <label htmlFor="username" className="form-label">Username or Email</label>
                            <input type="text" className="form-control" id="username" placeholder="Enter your username or email" />
                        </div>
                        <div>
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className='input-group'>
                                <input type="password" className="form-control" id="password" placeholder="Enter your password" />
                                <button className="btn btn-light py-0 center btnShowPass" onClick={handleShowPass} type="button">
                                    <span className="material-symbols-outlined eye">
                                        visibility
                                    </span>
                                </button>
                            </div>
                            <button type="button" className="btn btn-link text-decoration-none text-danger">Forgot Password?</button>
                        </div>
                        <div className='d-flex flex-column gap-2'>
                            {/* <button type="submit" className="btn btn-lg btn-success w-100">Login</button> */}
                            <Link to='/cms/dashboard' className="btn btn-lg btn-success">Login</Link>
                            <Link to='/cms/register' className="btn btn-lg btn-outline-secondary">Register</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
