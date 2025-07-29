import React from 'react'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
const ViewRequest = () => {
    return (
        <div className='d-flex vh-100'>
            <Sidebar />
            <div className="w-100 overflow-auto">
                <Header />
                <div className='p-3'>
                    <h3 className="text-start">View Request</h3>
                </div>
            </div>
        </div>
    )
}

export default ViewRequest
