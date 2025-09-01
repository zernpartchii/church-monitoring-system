import React from 'react'
import { Link } from 'react-router-dom'
const NotFound = () => {
    return (
        <div className='vh-100 d-flex flex-column justify-content-center align-items-center'>
            <div className='d-flex flex-column gap-3'>
                <img src='/notFound.png' height={300} alt='404' />
                <Link to='/' className='btn btn-warning text-dark'>Go back to Home Page</Link>
            </div>
        </div>
    )
}

export default NotFound
