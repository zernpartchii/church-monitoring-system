import React from 'react'
import Axios from 'axios';
import Swal from 'sweetalert2';

const url = 'http://localhost:5000/api'; // Adjust the URL as needed

export const CreatePastorAccount = (data) => {

    const accounts = {
        churchID: data.churchID,
        password: data.password
    }
    // remove the churchID, userID, username, password, and cpassword from the data
    data.churchID && delete data.churchID;
    data.password && delete data.password;
    data.cpassword && delete data.cpassword;

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
                        title: `<strong>${username}</strong>`,
                        text: 'Account successfully created.',
                        html: `You can use your username to login to your account.`,
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

export const generateUsersAccount = (data) => {

    const username = generateUsername(data.firstName + " " + data.lastName);
    const password = generatePassword(data.firstName, data.lastName);

    data.username = username;
    data.password = password;
    data.role = "user";

    // delete the first and last name from the data
    delete data.firstName;
    delete data.lastName;

    Axios.post(`${url}/createAccount`, data)
        .then((response) => {
            Swal.fire({
                icon: 'info',
                title: `Username: <strong>${username}</strong> <br> Password: <strong>${password}</strong>`,
                text: 'Account successfully created.',
                html: `You can use your username and password to login to your account.`,
                allowOutsideClick: false,
            })
        })
        .catch((error) => {
            console.log(error);
        })
}

export const generatePassword = (firstName, lastName) => {
    if (!firstName || !lastName) return '';

    const symbols = '!@#$%^&*';
    const randomNumber = Math.floor(10 + Math.random() * 90); // 2-digit number
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

    // Remove spaces from names
    const cleanFirst = firstName.replace(/\s+/g, '');
    const cleanLast = lastName.replace(/\s+/g, '');

    // Capitalize
    const capFirst = cleanFirst.charAt(0).toUpperCase() + cleanFirst.slice(1).toLowerCase();
    const capLast = cleanLast.charAt(0).toUpperCase() + cleanLast.slice(1).toLowerCase();

    return `${capFirst}${capLast}${randomNumber}${randomSymbol}`;
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

export default CreatePastorAccount;
