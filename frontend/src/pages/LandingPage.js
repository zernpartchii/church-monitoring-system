import React from 'react'
import { Link } from 'react-router-dom';
import '../css/landingPage.css';
import Header from './Header';
const LandingPage = () => {

    return (
        <div className='vh-100'>
            <div className='d-flex flex-wrap h-100'>
                <Header />
                <div className='left flex-fill center'>
                    <div className='p-5 me-5 mt-3'>
                        <p className='headings'>WELCOME TO</p>
                        <h1 className='title'><b>Christ Centered Assembly</b></h1>
                        <p className='subTitle'>Grow in faith, connect in love — let's build a Christ-centered community together!</p>

                        <div className='d-flex flex-wrap gap-2 mt-5'>
                            <Link to="/cms/register"><button type='button' className='btnRegister'>Register</button></Link>
                            <Link to="/cms/login"><button type='button' className='btnLogin'>Login</button></Link>
                        </div>
                    </div>
                </div>

                <div className='right flex-fill center'>
                    <img className='img-fluid rightLogo' src="./cca.png" alt="Christ Centered Assembly" />
                </div>
            </div>
        </div >
    )
}

export default LandingPage
