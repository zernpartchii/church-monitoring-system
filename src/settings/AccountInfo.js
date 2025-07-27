import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
function AccountInfo() {
    return (
        <div className="d-flex vh-100">
            <Sidebar />
            <div className="w-100 overflow-auto">
                <Header />
                <div className='px-3'>
                    <h3 className="m-0">Account Information</h3>
                    <p className="m-0">Change your account information here.</p>
                    <div className="card bg-light rounded-3 mt-3">
                        <div className="card-body d-flex flex-column gap-3">
                            <div>
                                <label htmlFor="hostPastor" className="form-label">Host Pastor</label>
                                <input type="text" name="hostPastor" required
                                    className="form-control" id="hostPastor" placeholder="Enter host pastor" />
                            </div>
                            <div>
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input type="email" name="email"
                                    className="form-control" id="email" placeholder="name@example.com" />
                            </div>
                            <div>
                                <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                                <input type="text" name="contactNumber"
                                    className="form-control" id="contactNumber" placeholder="Enter contact number (09XX-XXX-XXXX)" />
                            </div>
                            <div>
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Enter your password" />
                            </div>
                        </div>
                    </div>
                    <div className="card bg-light rounded-3 mt-3">
                        <div className="card-header">Church Information</div>
                        <div className="card-body d-flex flex-column gap-3">
                            <div>
                                <label htmlFor="churchName" className="form-label">Church Name</label>
                                <input type="text" name="churchName" required
                                    className="form-control" id="churchName" disabled placeholder="Enter church name" />
                            </div>
                            <div>
                                <label htmlFor="churchAddress" className="form-label">Church Address</label>
                                <input type="text" required
                                    className="form-control" id="churchAddress" placeholder="Enter church address" />
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary mt-3">Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountInfo
