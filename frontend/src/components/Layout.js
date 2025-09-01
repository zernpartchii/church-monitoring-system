import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
const Layout = () => {
    return (
        <div className='d-flex vh-100'>
            <Sidebar />
            <div className="w-100 overflow-auto">
                <Header />
                <Outlet />
            </div>
        </div>
    )
}

export default Layout
