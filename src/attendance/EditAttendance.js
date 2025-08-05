import Axios from "axios";
import Swal from 'sweetalert2';
export const editAttendance = () => {
    const btnEdit = document.querySelectorAll('.btnEditAttendance');
    const btnCancelAttendance = document.querySelectorAll('.btnCancelAttendance');
    const btnSaveAttendance = document.querySelectorAll('.btnSaveAttendance');

    // Edit
    btnEdit.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const selectStatus = document.querySelectorAll(`.selectStatus${index}`);
            const statusValue = document.querySelectorAll(`.statusValue${index}`);
            const statusBadge = document.querySelector(`.statusBadge${index}`);
            selectStatus.forEach((status, statusIndex) => {
                status.classList.remove('d-none');
                statusValue[statusIndex].classList.add('d-none');
                status.value = statusValue[statusIndex].textContent;
            })

            btnSaveAttendance[index].classList.remove('d-none');
            btnCancelAttendance[index].classList.remove('d-none');
            btnEdit[index].classList.add('d-none');
            statusBadge.classList.add('d-none');
        })
    })

    // Cancel
    btnCancelAttendance.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const selectStatus = document.querySelectorAll(`.selectStatus${index}`);
            const statusValue = document.querySelectorAll(`.statusValue${index}`);
            const statusBadge = document.querySelector(`.statusBadge${index}`);

            selectStatus.forEach((status, statusIndex) => {
                status.classList.add('d-none');
                statusValue[statusIndex].classList.remove('d-none');
            })

            btn.classList.add('d-none');
            statusBadge.classList.remove('d-none');
            btnEdit[index].classList.remove('d-none');
            btnSaveAttendance[index].classList.add('d-none');
            document.querySelector('.refreshAttendance').click();
        })
    })

    // Save
    btnSaveAttendance.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const data = [];
            const selectStatus = document.querySelectorAll(`.selectStatus${index}`);
            const statusValue = document.querySelectorAll(`.statusValue${index}`);
            const statusBadge = document.querySelector(`.statusBadge${index}`);

            selectStatus.forEach((status, statusIndex) => {
                status.classList.add('d-none');
                statusValue[statusIndex].classList.remove('d-none');

                const [userID, service, date] = status.getAttribute('user-data').split('|');
                data.push({ userID, service, date, status: status.value });
            })

            Axios.post('http://localhost:5000/api/insertAttendance', data)
                .then((response) => {
                    console.log(response.data);
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Successfully Updated!",
                        text: "Attendance has been updated successfully.",
                    });

                    statusBadge.classList.remove('d-none');
                    btnEdit[index].classList.remove('d-none');
                    btnCancelAttendance[index].classList.add('d-none');
                    btnSaveAttendance[index].classList.add('d-none');
                    document.querySelector('.refreshAttendance').click();
                }).catch((error) => {
                    console.error(error);
                });
        })
    })
}

export default editAttendance

