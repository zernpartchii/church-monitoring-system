import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { formatDateForInput, formatDateTime } from '../util/DateFomatter';

const ChurchgoerModal = ({ userData }) => {

    const url = 'http://localhost:5000/api'; // Adjust the URL as needed
    const data = {
        firstName: null,
        middleName: null,
        lastName: null,
        dateOfBirth: null,
        gender: null,
        address: null,
        email: null,
        contactNo: null,
    }

    const [formData, setFormData] = useState([]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    useEffect(() => {
        if (userData) {
            setFormData(userData);
            document.querySelector('.btnDeleteChurchgoer')?.classList.remove('d-none');
        }
        document.querySelector('.btnAddChurchgoer')?.addEventListener('click', () => {
            handleResetForms();
            document.querySelector('.btnDeleteChurchgoer')?.classList.add('d-none');
        });
    }, [userData]);

    const handleResetForms = () => {
        // Optionally reset
        setFormData(data);

        // Close the modal
        document.querySelector('.btn-close')?.click();
        document.querySelector('.refreshAttendance')?.click();
    };

    const handleCreateUserData = () => {
        Axios.post(`${url}/insertChurchGoer`, formData)
            .then((response) => {
                // console.log(response.data.message);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Successfully Added!",
                    text: `${formData.firstName} ${formData.lastName}'s record has been added successfully.`,
                });
                handleResetForms();
            })
            .catch((error) => {
                console.log(error);
            })
    };

    const handleUpdateUserData = (data) => {
        // Replace undefined with null values
        const mergedFormData = Object.fromEntries(
            Object.entries(data).map(([key]) => {
                const value = formData[key];
                return [key, value !== undefined ? value : null];
            })
        );

        // Add the `id` field
        mergedFormData.id = data.id

        // Remove the `dateCreated` field 
        delete mergedFormData.dateCreated;

        // Update the `dateOfBirth and dateModified` field
        mergedFormData.dateOfBirth = formatDateForInput(mergedFormData.dateOfBirth);
        mergedFormData.dateModified = formatDateTime(new Date());

        // Send the updated data
        Axios.put(`${url}/updateChurchGoer`, mergedFormData)
            .then((response) => {
                // console.log(response.data.message);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Successfully Updated!",
                    text: `${mergedFormData.firstName} ${mergedFormData.lastName}'s information has been successfully updated!`
                });
                handleResetForms();
            })
            .catch((error) => {
                console.log(error);
            })
    };

    const handleDeleteUserData = () => {

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "Delete this record?",
            text: `Are you sure you want to delete ${formData.firstName} ${formData.lastName} record?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                Axios.delete(`${url}/deleteChurchGoer`, { data: { id: formData.id } })
                    .then((response) => {
                        // console.log(response.data.message);
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Successfully Deleted!",
                            text: `${formData.firstName} ${formData.lastName}'s record has been deleted successfully.`,
                        });
                        handleResetForms();
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        });

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post(`${url}/checkChurchGoer`, formData)
            .then((response) => {
                if (response.data.length > 0) {
                    const swalWithBootstrapButtons = Swal.mixin({
                        customClass: {
                            confirmButton: "btn btn-success",
                            cancelButton: "btn btn-danger"
                        },
                        buttonsStyling: false
                    });
                    swalWithBootstrapButtons.fire({
                        title: `A record already exists for ${formData.firstName} ${formData.lastName}`,
                        text: "Would you like to update it?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, update it!",
                        cancelButtonText: "No, cancel!",
                        reverseButtons: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            handleUpdateUserData(response.data[0]);
                        }
                    });
                } else {
                    handleCreateUserData();
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
                                    <input type="text" className="form-control" id="firstName" value={formData.firstName || ""} onChange={handleChange} required />
                                </div>
                                <div className="flex-fill">
                                    <label htmlFor="middleName" className="form-label">Middle Name</label>
                                    <input type="text" className="form-control" id="middleName" value={formData.middleName || ""} onChange={handleChange} />
                                </div>
                                <div className="flex-fill">
                                    <label htmlFor="lastName" className="form-label">Last Name</label>
                                    <input type="text" className="form-control" id="lastName" value={formData.lastName || ""} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="d-flex flex-wrap gap-3">
                                <div className="flex-fill">
                                    <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                                    <input type="date" className="form-control" id="dateOfBirth" value={formatDateForInput(formData.dateOfBirth) || ""} onChange={handleChange} />
                                </div>
                                <div className="flex-fill">
                                    <label htmlFor="gender" className="form-label">Gender</label>
                                    <select className="form-select" id="gender" value={formData.gender || ""} onChange={handleChange} required>
                                        <option value="">Choose...</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="flex-fill w-100">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <input type="text" className="form-control" id="address" value={formData.address || ""} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="d-flex flex-wrap gap-3">
                                <div className="flex-fill">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input type="email" className="form-control" id="email" value={formData.email || ""} onChange={handleChange} />
                                </div>
                                <div className="flex-fill">
                                    <label htmlFor="contactNo" className="form-label">Contact Number</label>
                                    <input type="tel" className="form-control" id="contactNo" value={formData.contactNo || ""} onChange={handleChange} />
                                </div>
                            </div>

                        </div>

                        <div className="modal-footer d-flex">
                            <button type="button" className="btn btn-danger me-auto btnDeleteChurchgoer" onClick={handleDeleteUserData}>Delete</button>
                            <button type="button" className="btn btn-secondary btn-Cancel" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" className="btn btn-success">Save Changes</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default ChurchgoerModal;
