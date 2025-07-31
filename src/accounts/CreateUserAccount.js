import React from 'react'
import Axios from 'axios';
import Swal from 'sweetalert2';
export const CreateUserAccount = (data) => {

    const accounts = {
        churchID: data.churchID,
        password: data.password
    }

    // remove the churchID, userID, username, password, and cpassword from the data
    data.churchID && delete data.churchID;
    data.password && delete data.password;
    data.cpassword && delete data.cpassword;

    const url = 'http://localhost:5000/api'; // Adjust the URL as needed
    Axios.post(`${url}/insertChurchGoer`, data)
        .then((response) => {
            const username = generateUsername(data.firstName + " " + data.lastName);

            data.userID = response.data.id;
            data.username = username;
            data.role = "admin";

            // merge the two objects
            data = { ...data, ...accounts };

            Axios.post(`${url}/createAccount`, data)
                .then((response) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Account successfully created.',
                        showConfirmButton: false,
                        allowOutsideClick: false, // optional: block clicks outside
                        footer: '<a href="/cms/login" class="btn btn-success">Click here to login</a>'
                    })
                })
                .catch((error) => {
                    console.log(error);
                })

            // console.log("Final Data: ", data);
        })
        .catch((error) => {
            console.log(error);
        })

}

export const generateUsername = (fullName) => {
    const nameParts = fullName.trim().toLowerCase().split(" ");
    let username = "";

    if (nameParts.length === 1) {
        // e.g., "Prince"
        username = nameParts[0];
    } else {
        // e.g., "John Doe" → "jdoe"
        const first = nameParts[0][0]; // first initial
        const last = nameParts[nameParts.length - 1]; // last name
        username = first + last;
    }

    // Add a random 3-digit number to ensure uniqueness
    const randomNum = Math.floor(100 + Math.random() * 900);
    return username + randomNum;
};

export default CreateUserAccount;
