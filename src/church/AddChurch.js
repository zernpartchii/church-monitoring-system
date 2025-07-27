import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Axios from 'axios'
import Swal from 'sweetalert2'

function AddChurch() {

    const url = 'http://localhost:5000/api'; // Adjust the URL as needed
    const data = {
        churchName: '',
        churchAddress: '',
        hostPastor: '',
        email: '',
        contactNumber: ''
    }
    const [formData, setFormData] = useState(data);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        Axios.post(`${url}/checkChurchName`, formData)
            .then((response) => {
                if (response.data.length > 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Already Exists!',
                        text: formData.churchName + "  already exists!"
                    });
                    return;
                } else {
                    Axios.post(`${url}/insertChurch`, formData)
                        .then((response) => {
                            // console.log(response.data.message);
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Success!",
                                text: formData.churchName + " has been added successfully.",
                            });

                            // console.log(formData);
                            setFormData(data);
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
        <div className='container d-flex justify-content-center align-items-center h-100'>
            <form onSubmit={handleSubmit} className="d-flex gap-3 row card p-5" style={{ width: '700px' }}>
                <div>
                    <h2>Church Registration</h2>
                    <p>Your secure entry to monitor, manage, and serve.</p>
                </div>
                <div>
                    <label htmlFor="churchName" className="form-label">Church Name</label>
                    <input type="text" value={formData.churchName} onChange={handleChange} name="churchName" required
                        className="form-control" id="churchName" placeholder="Enter church name" />
                </div>
                <div>
                    <label htmlFor="churchAddress" className="form-label">Church Address</label>
                    <input type="text" value={formData.churchAddress} onChange={handleChange} name="churchAddress" required
                        className="form-control" id="churchAddress" placeholder="Enter church address" />
                </div>
                <div>
                    <label htmlFor="hostPastor" className="form-label">Host Pastor</label>
                    <input type="text" value={formData.hostPastor} onChange={handleChange} name="hostPastor" required
                        className="form-control" id="hostPastor" placeholder="Enter host pastor" />
                </div>
                <div>
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" value={formData.email} onChange={handleChange} name="email"
                        className="form-control" id="email" placeholder="name@example.com" />
                </div>
                <div>
                    <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                    <input type="text" value={formData.contactNumber} onChange={handleChange} name="contactNumber"
                        className="form-control" id="contactNumber" placeholder="Enter contact number (09XX-XXX-XXXX)" />
                </div>
                <div className='d-flex column gap-2'>
                    <button type="submit" className="btn btn-lg  btn-success w-100">Register</button>
                    <Link to='/cms/register' className="btn btn-lg btn-dark w-100">Back</Link>
                </div>
            </form>
        </div>
    )
}

export default AddChurch
