import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import Swal from 'sweetalert2';
const Attendance = () => {

    const attendanceStatus = document.querySelectorAll('.attendanceStatus');
    const saveChanges = document.querySelector('.saveChanges');
    const data = [];
    useEffect(() => {
        saveChanges?.addEventListener('click', () => {
            attendanceStatus.forEach((status) => {
                const [userID, service, date, attendanceStatusValue] = status.value.split('|');
                // Check for duplicates by userID and date
                const exists = data.some(
                    (entry) => entry.userID === userID && entry.date === date && entry.status === attendanceStatusValue
                );

                if (!exists) {
                    data.push({ userID, service, date, status: attendanceStatusValue });
                } else {
                    // Update the existing record's status
                    data.forEach((entry) => {
                        if (entry.userID === userID && entry.date === date && entry.service === service) {
                            entry.status = attendanceStatusValue;
                        }
                    });
                }
            });

            console.log(data)

            // Axios.post('http://localhost:5000/api/insertAttendance', { userID, service: serviceDay, date, status: attendanceStatusValue })
            //     .then((response) => {
            //         console.log(response.data);
            //         if (response.data.length > 0) {
            //             Swal.fire({
            //                 position: "center",
            //                 icon: "success",
            //                 title: "Successfully Updated!",
            //                 text: "Attendance has been updated successfully.",
            //             });
            //         }
            //     }).catch((error) => {
            //         console.error(error);
            //     });  

        })
    })


    return (
        <div>

        </div>
    )
}

export default Attendance
