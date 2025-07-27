import React from 'react'
import { Link } from 'react-router-dom'
function Login() {
    return (
        <div className='container d-flex justify-content-center align-items-center h-100'>
            <form className="d-flex gap-3 border rounded-3 row p-5" style={{ width: '700px' }}>
                <div>
                    <h2>CCA Church Monitoring System</h2>
                    <p>Your secure entry to monitor, manage, and serve.</p>
                </div>
                <div>
                    <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
                </div>
                <div>
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Enter your password" />
                    <button type="button" className="btn btn-link text-decoration-none text-danger">Forgot Password?</button>
                </div>
                <div className='d-flex gap-2'>
                    {/* <button type="submit" className="btn btn-lg btn-success w-100">Login</button> */}
                    <Link to='/cms/dashboard' className="btn btn-lg btn-success w-100">Login</Link>
                    <Link to='/cms/register' className="btn btn-lg btn-outline-primary w-100">Register</Link>
                </div>
            </form>
        </div>
    )
}

export default Login
