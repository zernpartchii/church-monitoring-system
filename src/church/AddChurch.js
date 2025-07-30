
import Axios from 'axios'
import Swal from 'sweetalert2'

export const AddChurch = (church) => {

    const url = 'http://localhost:5000/api'; // Adjust the URL as needed 
    Axios.post(`${url}/checkChurchName`, church)
        .then((response) => {
            if (response.data.length > 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Already Exists!',
                    text: church.churchName + "  already exists!"
                });
                return;
            } else {
                Axios.post(`${url}/insertChurch`, church)
                    .then((response) => {
                        // console.log(response.data.message);
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Success!",
                            text: church.churchName + " has been added successfully.",
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        })
        .catch((error) => {
            console.log(error);
        })
}

export const AddPastors = (data) => {
    const url = 'http://localhost:5000/api'; // Adjust the URL as needed 
    Axios.post(`${url}/insertChurchGoer`, data)
        .then((response) => {
            // console.log(response.data.message);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Success!",
                text: data.firstName + " " + data.lastName + " has been added successfully.",
            });
        })
        .catch((error) => {
            console.log(error);
        })
}

export default AddChurch
