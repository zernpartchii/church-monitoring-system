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
                    <div className='card border-0 h-100'>
                        <div className='card-header'>

                        </div>
                        <div className='card-body'>

                        </div>
                        <div className='card-footer'>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewRequest
