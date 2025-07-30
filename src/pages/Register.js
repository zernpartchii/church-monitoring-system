import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';
import { AddChurch, AddPastors } from '../church/AddChurch';
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
            return;
        }

        delete pastors.password;
        delete pastors.cpassword;

        AddChurch(church);
        AddPastors(pastors);

        //reset fields
        setChurch(churchData);
        setPastors(pastorsData);

        //redirect to login
        navigate('/cms/login');

    }

    const handleShowPass = () => {
        const passwordInput = document.querySelectorAll('#password, #cpassword');
        passwordInput.forEach((input) => {
            if (input.type === 'password') {
                input.type = 'text';
            } else {
                input.type = 'password';
            }
        });
    };

    return (
        <div className='vh-100'>
            <div className='center'>
                <form className='card border-0 p-3 m-3' onSubmit={handleSubmit} style={{ maxWidth: '700px' }}>
                    <div className='card-header bg-transparent'>
                        <h2>Worship Track</h2>
                        <p>Your secure entry to monitor, manage, and serve.</p>
                    </div>
                    <div className="card-body d-flex gap-3 flex-column" >
                        <div className='flex-fill'>
                            <label htmlFor="churchName" className="form-label">Church Name</label>
                            <input type="text" required value={church.churchName} onChange={handleChurchChange} className="form-control" id="churchName" placeholder="Enter church name" />
                        </div>
                        <div className='flex-fill'>
                            <label htmlFor="churchAddress" className="form-label">Church Address</label>
                            <input type="text" required value={church.churchAddress} onChange={handleChurchChange} className="form-control" id="churchAddress" placeholder="Enter church address" />
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
                        <div className='flex flex-wrap'>
                            <div className='flex-fill'>
                                <label htmlFor="gender" className="form-label">Gender</label>
                                <select required value={pastors.gender} onChange={handlePastorsChange} className="form-select" id="gender">
                                    <option value='' disabled selected>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className='flex-fill'>
                                <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                                <input type="date" required value={pastors.dateOfBirth} onChange={handlePastorsChange} className="form-control" id="dateOfBirth" />
                            </div>
                        </div>
                        <div className='flex-fill'>
                            <label htmlFor="address" className="form-label">Address</label>
                            <input type="text" required value={pastors.address} onChange={handlePastorsChange} className="form-control" id="address" placeholder="Enter your address" />
                        </div>
                        <div className='flex flex-wrap'>
                            <div className='flex-fill'>
                                <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                                <input type="email" value={pastors.email} onChange={handlePastorsChange} className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
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
                                    <input type="password" required value={pastors.password} onChange={handlePastorsChange} className="form-control" id="password" placeholder="Enter your password" />
                                    <button className="btn btn-light py-0 center btnShowPass" onClick={handleShowPass} type="button">
                                        <span className="material-symbols-outlined">
                                            visibility
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className='flex-fill'>
                                <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                                <div className='input-group'>
                                    <input type="password" required value={pastors.cpassword} onChange={handlePastorsChange} className="form-control" id="cpassword" placeholder="Confirm your password" />
                                    <button className="btn btn-light py-0 center btnShowPass" onClick={handleShowPass} type="button">
                                        <span className="material-symbols-outlined">
                                            visibility
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='d-flex flex-column gap-2'>
                            <button type="submit" className="btn btn-lg  btn-success">Register</button>
                            <Link to='/cms/login' className="btn btn-lg btn-outline-secondary">Login</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
