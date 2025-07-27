import React from 'react'

import { Link } from 'react-router-dom'
function Register() {
    return (
        <div className='container d-flex justify-content-center align-items-center h-100'>
            <form className="d-flex gap-3 row card p-5" style={{ width: '700px' }}>
                <div>
                    <h2>CCA Church Monitoring System</h2>
                    <p>Your secure entry to monitor, manage, and serve.</p>
                </div>
                <div>
                    <label htmlFor="church" className="form-label">Church</label>
                    <select className="form-select" id='church'>
                        <option hidden>Select</option>
                        <option value="">Humilog</option>
                        <option value="">New Corella</option>
                        <option value="">Pendasan</option>
                        <option value="">RTR</option>
                        <option value="">Tagum</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="hostPastor" className="form-label">Host Pastor</label>
                    <input type="text" className="form-control" id="hostPastor" placeholder="Enter Host Pastor" />
                </div>
                <div>
                    <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
                </div>
                <div>
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Enter your password" />
                </div>
                <div>
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" placeholder="Confirm your password" />
                </div>
                <div className='d-flex column gap-2'>
                    <button type="submit" className="btn btn-lg  btn-success w-100">Register</button>
                    <Link to='/cms/login' className="btn btn-lg btn-outline-primary w-100">Login</Link>
                </div>
                <Link to='/cms/add-church' className="btn btn-lg btn-dark w-100">Add Church</Link>
            </form>
        </div>
    )
}

export default Register
