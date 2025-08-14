import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';
import { AddChurch } from '../church/AddChurch';
import Header from './Header';
import '../css/register.css';
const Register = () => {

    const navigate = useNavigate();

    const churchData = {
        churchName: '',
        churchAddress: '',
    }

    const pastorsData = {
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        email: '',
        contactNo: '',
        password: '',
        cpassword: ''
    }

    const [church, setChurch] = useState(churchData);
    const [pastors, setPastors] = useState(pastorsData);

    useEffect(() => {
        //reset fields
        setChurch(churchData);
        setPastors(pastorsData);
    }, [])

    const handleChurchChange = (e) => {
        const { id, value } = e.target;
        setChurch((prevData) => ({
            ...prevData,
            [id]: value
        }));
    }

    const handlePastorsChange = (e) => {
        const { id, value } = e.target;
        setPastors((prevData) => ({
            ...prevData,
            [id]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (pastors.password !== pastors.cpassword) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Password do not match!',
            })
            setPastors((prevData) => ({
                ...prevData,
                password: '',
                cpassword: ''
            }));
            return;
        }

        AddChurch(church, pastors);
    }

    const handleShowPass = () => {
        const passwordInput = document.querySelectorAll('#password, #cpassword');
        const eye = document.querySelectorAll('.eye');
        passwordInput.forEach((input) => {
            if (input.type === 'password') {
                input.type = 'text';
                eye.forEach((eyeIcon) => {
                    eyeIcon.textContent = 'visibility_off';
                });
            } else {
                input.type = 'password';
                eye.forEach((eyeIcon) => {
                    eyeIcon.textContent = 'visibility';
                });
            }
        });
    };

    return (
        <div className='vh-100 registerBody'>
            <div className='center'>
                <Header />
                <div className='d-flex flex-wrap center shadow-lg registerForm mx-3'>
                    <img className='m-0' height={340} src="../cca.png" alt="Christ Centered Assembly" />
                    <form className='card bg-transparent text-white border-0 p-3' onSubmit={handleSubmit} style={{ maxWidth: '70rem' }}>
                        <div className='card-header bg-transparent border-light'>
                            <h3>PraiseTrack Manager</h3>
                            <p>Your centralized worship management system.</p>
                        </div>
                        <div className="card-body d-flex flex-wrap gap-3" >

                            <div className='d-flex flex-fill gap-3'>
                                <div className='flex-fill'>
                                    <label htmlFor="churchName" className="form-label">Church Name</label>
                                    <input type="text" required value={church.churchName} onChange={handleChurchChange} className="form-control" id="churchName" placeholder="Enter church name" />
                                </div>
                                <div className='flex-fill'>
                                    <label htmlFor="churchAddress" className="form-label">Church Address</label>
                                    <input type="text" required value={church.churchAddress} onChange={handleChurchChange} className="form-control" id="churchAddress" placeholder="Enter church address" />
                                </div>
                            </div>

                            <div className='flex-fill'>
                                <label htmlFor="hostPastor" className="form-label">Host Pastor</label>
                                <div className='flex flex-wrap'>
                                    <div className='flex-fill'>
                                        <input type="text" required value={pastors.firstName} onChange={handlePastorsChange} className="form-control" id="firstName" placeholder="First Name" />
                                    </div>
                                    <div className='flex-fill'>
                                        <input type="text" value={pastors.middleName} onChange={handlePastorsChange} className="form-control" id="middleName" placeholder="Middle Name" />
                                    </div>
                                    <div className='flex-fill'>
                                        <input type="text" required value={pastors.lastName} onChange={handlePastorsChange} className="form-control" id="lastName" placeholder="Last Name" />
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-wrap gap-3 w-100'>
                                <div className='flex-fill'>
                                    <label htmlFor="gender" className="form-label">Gender</label>
                                    <select required value={pastors.gender} onChange={handlePastorsChange} className="form-select" id="gender">
                                        <option value='' disabled>Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className='flex-fill'>
                                    <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                                    <input type="date" required value={pastors.dateOfBirth} onChange={handlePastorsChange} className="form-control" id="dateOfBirth" />
                                </div>
                                <div className='w-100'>
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <input type="text" required value={pastors.address} onChange={handlePastorsChange} className="form-control" id="address" placeholder="Enter your address" />
                                </div>
                            </div>

                            <div className='flex flex-wrap flex-fill'>
                                <div className='flex-fill'>
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input type="email" value={pastors.email} onChange={handlePastorsChange} className="form-control" id="email" placeholder="name@example.com" />
                                </div>
                                <div className='flex-fill'>
                                    <label htmlFor="contactNo" className="form-label">Contact No.</label>
                                    <input type="number" value={pastors.contactNo} onChange={handlePastorsChange} className="form-control" id="contactNo" placeholder="Enter your contact no." />
                                </div>
                            </div>

                            <div className='flex flex-wrap'>
                                <div className='flex-fill'>
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className='input-group'>
                                        <input type="password" required value={pastors.password || ""} onChange={handlePastorsChange} className="form-control" id="password" placeholder="Enter your password" />
                                        <button className="btn btn-light py-0 center btnShowPass" onClick={handleShowPass} type="button">
                                            <span className="material-symbols-outlined eye">
                                                visibility
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className='flex-fill'>
                                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                                    <div className='input-group'>
                                        <input type="password" required value={pastors.cpassword || ""} onChange={handlePastorsChange} className="form-control" id="cpassword" placeholder="Confirm your password" />
                                        <button className="btn btn-light py-0 center btnShowPass" onClick={handleShowPass} type="button">
                                            <span className="material-symbols-outlined eye">
                                                visibility
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='card-footer bg-transparent border-0'>
                            <button type="submit" className="btn btn-success">Register</button>
                            <p className='mt-3'>Already have an account? <Link to='/cms/login' className="text-decoration-none badge bg-warning text-dark">Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
