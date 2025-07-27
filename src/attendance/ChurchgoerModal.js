import React, { useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
const ChurchgoerModal = ({ onSave }) => {
    const url = 'http://localhost:5000/api'; // Adjust the URL as needed
    const data = {
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '0001-01-01',
        gender: '',
        address: '',
        email: '',
        contactNo: '',
    }
    const [formData, setFormData] = useState(data);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call parent handler if provided
        if (onSave) {
            onSave(formData);
        }

        Axios.post(`${url}/checkChurchGoer`, formData)
            .then((response) => {
                // console.log(response.data.message);
                if (response.data.length > 0) {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Already Exists!",
                        text: formData.firstName + " " + formData.lastName + " already exists!",
                    });
                } else {
                    Axios.post(`${url}/insertChurchGoer`, formData)
                        .then((response) => {
                            // console.log(response.data.message);
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Successfully Added!",
                                text: formData.firstName + " " + formData.lastName + " has been added successfully.",
                            });

                            // Optionally reset
                            setFormData(data);

                            // Close the modal
                            document.querySelector('.btn-close').click();
                            document.querySelector('.refreshAttendance').click();
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                }
            })
            .catch((error) => {
                console.log(error);
            })
    };

    return (
        <div
            className="modal fade"
            id="addChurchgoerModal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="addChurchgoerModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="addChurchgoerModalLabel">Churchgoer Information</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body d-flex flex-column gap-3">

                            <div className="d-flex flex-wrap gap-3">
                                <div className="flex-fill">
                                    <label htmlFor="firstName" className="form-label">First Name</label>
                                    <input type="text" className="form-control" id="firstName" value={formData.firstName} onChange={handleChange} required />
                                </div>
                                <div className="flex-fill">
                                    <label htmlFor="middleName" className="form-label">Middle Name</label>
                                    <input type="text" className="form-control" id="middleName" value={formData.middleName} onChange={handleChange} />
                                </div>
                                <div className="flex-fill">
                                    <label htmlFor="lastName" className="form-label">Last Name</label>
                                    <input type="text" className="form-control" id="lastName" value={formData.lastName} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="d-flex flex-wrap gap-3">
                                <div className="flex-fill">
                                    <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                                    <input type="date" className="form-control" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                                </div>
                                <div className="flex-fill">
                                    <label htmlFor="gender" className="form-label">Gender</label>
                                    <select className="form-select" id="gender" value={formData.gender} onChange={handleChange} required>
                                        <option value="">Choose...</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="flex-fill w-100">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <input type="text" className="form-control" id="address" value={formData.address} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="d-flex flex-wrap gap-3">
                                <div className="flex-fill">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} />
                                </div>
                                <div className="flex-fill">
                                    <label htmlFor="contactNo" className="form-label">Contact Number</label>
                                    <input type="tel" className="form-control" id="contactNo" value={formData.contactNo} onChange={handleChange} />
                                </div>
                            </div>

                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" className="btn btn-success">Save Churchgoer</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default ChurchgoerModal;
