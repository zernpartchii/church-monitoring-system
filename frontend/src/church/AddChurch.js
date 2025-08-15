
import Axios from 'axios'
import Swal from 'sweetalert2'
import CreateUserAccount from '../accounts/CreateUserAccount'
import { formatDateTime } from '../util/DateFomatter'

export const AddChurch = (churchData, pastorsData) => {

    const url = 'http://localhost:5000/api'; // Adjust the URL as needed 
    Axios.post(`${url}/checkChurchName`, churchData)
        .then((response) => {
            if (response.data.length > 0) {
                Swal.fire({
                    icon: 'error',
                    title: churchData.churchName + " already exists!",
                    text: 'Someone has already registered this church. Please use a different name again.',
                });
            } else {
                AddPastors(churchData, pastorsData);
            }
        })
        .catch((error) => {
            console.log(error);
        })
}


export const AddPastors = (churchData, pastorsData) => {

    const password = pastorsData.password;

    delete pastorsData.password;
    delete pastorsData.cpassword;

    const url = 'http://localhost:5000/api'; // Adjust the URL as needed 
    Axios.post(`${url}/checkChurchGoer`, pastorsData)
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
                    title: `A record already exists for ${pastorsData.firstName} ${pastorsData.lastName}`,
                    text: "Would you like to update it?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, update it!",
                    cancelButtonText: "No, cancel!",
                    reverseButtons: true,
                }).then((result) => {
                    if (result.isConfirmed) {

                        pastorsData.username && delete pastorsData.username;
                        pastorsData.churchID && delete pastorsData.churchID;

                        pastorsData.id = response.data[0].id;
                        pastorsData.dateModified = formatDateTime(new Date());

                        Axios.put(`${url}/updateChurchGoer`, pastorsData)
                            .then((response) => {
                                // console.log(response.data.message);
                                Swal.fire({
                                    position: "center",
                                    icon: "success",
                                    title: "Successfully Updated!",
                                    text: `${pastorsData.firstName} ${pastorsData.lastName}'s information has been successfully updated!`
                                });
                                pastorsData.password = password;
                                RegisterChurch(churchData, pastorsData);
                            })
                            .catch((error) => {
                                console.log(error);
                            })

                    } else {
                        pastorsData.password = password;
                        RegisterChurch(churchData, pastorsData);
                    }
                });
            } else {
                pastorsData.password = password;
                RegisterChurch(churchData, pastorsData);
            }
        })
        .catch((error) => {
            console.log(error);
        })
}

const RegisterChurch = (churchData, pastorsData) => {
    const url = 'http://localhost:5000/api'; // Adjust the URL as needed 
    Axios.post(`${url}/insertChurch`, churchData)
        .then((response) => {
            pastorsData.churchID = response.data.id;
            CreateUserAccount(pastorsData);
        })
        .catch((error) => {
            console.log(error);
        })
}



export default AddChurch
