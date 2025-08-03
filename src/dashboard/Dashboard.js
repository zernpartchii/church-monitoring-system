import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { AuthContext } from '../auth/AuthContext'; // adjust path
function Dashboard() {

    const { user, login, logout } = useContext(AuthContext);

    return (
        <div className="d-flex vh-100">
            <Sidebar />
            <div className="w-100 overflow-auto">
                <Header />
                <div className='p-3'>
                    <h3 className="text-start">Dashboard</h3>
                    <h1>Test Auth Context</h1>
                    <p>User: {user ? JSON.stringify(user) : 'Not logged in'}</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
