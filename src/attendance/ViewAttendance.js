import React, { useState, useEffect, use } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import ChurchgoerModal from './ChurchgoerModal';
import Axios from 'axios';
import { formatByName, sortAttendanceBy } from './SortAndFilter';
import editAttendance from './EditAttendance';
const getDaysInMonthByType = (year, month, type = 'Sundays') => {
    const dates = [];
    const date = new Date(year, month, 1);

    while (date.getMonth() === month) {
        const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        if (
            (type === 'Sundays' && day === 0) ||
            (type === 'Weekdays' && day >= 1 && day <= 6)
        ) {
            dates.push(new Date(date));
        }
        date.setDate(date.getDate() + 1);
    }

    return dates;
};


function ViewAttendance() {
    // 
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth());  // dynamically use current month
    const [year, setYear] = useState(today.getFullYear()); // dynamically use current yearx)
    const [sundays, setSundays] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [churchgoers, setChurchgoers] = useState([]);
    const [userData, setUserData] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('Sundays');

    const refreshAttendance = () => {
        const sundaysInMonth = getDaysInMonthByType(year, month, viewMode);
        setSundays(sundaysInMonth); // ← Add this
        Promise.all([
            Axios.get('http://localhost:5000/api/churchgoers'),
            Axios.get('http://localhost:5000/api/attendances')
        ])
            .then(([churchgoersRes, attendanceRes]) => {
                const churchgoers = churchgoersRes.data;
                const attendances = attendanceRes.data;
                //get attendance
                const attendanceMap = new Map();
                attendances.forEach(att => {
                    const dateKey = new Date(att.date).toLocaleDateString('en-CA');
                    const key = `${att.userID}-${dateKey}`;
                    attendanceMap.set(key, att.status);
                });

                //combine churchgoers and attendance
                const mapped = churchgoers.map((person) => {
                    const personAttendance = sundaysInMonth.map((sunday) => {
                        const dateKey = new Date(sunday).toLocaleDateString('en-CA'); // 'YYYY-MM-DD' in local time
                        const key = `${person.id}-${dateKey}`;
                        return attendanceMap.get(key) || "Visitor";
                    });

                    return {
                        id: person.id,
                        fullName: `${person.firstName} ${person.middleName || ''} ${person.lastName}`.trim(),
                        formalName: `${person.lastName}, ${person.firstName} ${person.middleName || ''}`.trim(),
                        dob: person.dateOfBirth,
                        records: personAttendance,
                        dateCreated: person.dateCreated
                    };
                });

                // Sort by name DESCENDING
                mapped.sort((a, b) => {
<<<<<<< Updated upstream
                    const nameA = a.dateCreated.toLowerCase();
                    const nameB = b.dateCreated.toLowerCase();
                    if (nameA > nameB) return -1;
                    if (nameA < nameB) return 1;
=======
                    const dateA = a.dateCreated.toLowerCase();
                    const dateB = b.dateCreated.toLowerCase();

                    if (dateA > dateB) return -1;
                    if (dateA < dateB) return 1;
>>>>>>> Stashed changes
                    return 0;
                });

                setAttendance(mapped);
                setChurchgoers(churchgoers);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const attendanceCheck = () => {
        const sundaysInMonth = getDaysInMonthByType(year, month, viewMode);
        setSundays(sundaysInMonth);
        setAttendance(prev =>
            prev.map(user => {
                // Only reset if record count mismatches
                if (user.records.length !== sundaysInMonth.length) {
                    return {
                        ...user,
                        records: sundaysInMonth.map(() => 'Visitor'),
                    };
                }
                return user;
            })
        );
    }

    useEffect(() => {
        const refresh = document.querySelector('.refreshAttendance');
        refresh.addEventListener('click', () => {
            refreshAttendance();

            document.querySelector('.searchChurchgoer').value = '';
            setSearchTerm('');
        });
        refresh.click();
    }, []);

    useEffect(() => {
        editAttendance();
    }, [attendance])

    useEffect(() => {
        attendanceCheck();
        refreshAttendance();
    }, [year, month, viewMode]);

<<<<<<< Updated upstream

    const editAttendance = () => {
        const btnEdit = document.querySelectorAll('.btnEditAttendance');
        const btnCancelAttendance = document.querySelectorAll('.btnCancelAttendance');
        const btnSaveAttendance = document.querySelectorAll('.btnSaveAttendance');
        btnEdit.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const selectStatus = document.querySelectorAll(`.selectStatus${index}`);
                const statusValue = document.querySelectorAll(`.statusValue${index}`);

                selectStatus.forEach((status, statusIndex) => {
                    status.classList.remove('d-none');
                    statusValue[statusIndex].classList.add('d-none');
                })

                btnSaveAttendance[index].classList.remove('d-none');
                btnCancelAttendance[index].classList.remove('d-none');
                btnEdit[index].classList.add('d-none');
            })
        })
        btnCancelAttendance.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const selectStatus = document.querySelectorAll(`.selectStatus${index}`);
                const statusValue = document.querySelectorAll(`.statusValue${index}`);

                selectStatus.forEach((status, statusIndex) => {
                    status.classList.add('d-none');
                    statusValue[statusIndex].classList.remove('d-none');
                })
                refreshAttendance();
                btn.classList.add('d-none');
                btnEdit[index].classList.remove('d-none');
                btnSaveAttendance[index].classList.add('d-none');
            })
        })
        btnSaveAttendance.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const data = [];
                const selectStatus = document.querySelectorAll(`.selectStatus${index}`);
                const statusValue = document.querySelectorAll(`.statusValue${index}`);

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
                    }).catch((error) => {
                        console.error(error);
                    });

                refreshAttendance();
                btnEdit[index].classList.remove('d-none');
                btnCancelAttendance[index].classList.add('d-none');
                btnSaveAttendance[index].classList.add('d-none');
            })
        })
    }
=======
>>>>>>> Stashed changes

    const sundayColumns = sundays.map((date, idx) => {
        const label = `${idx + 1}${idx === 0 ? 'st' : idx === 1 ? 'nd' : idx === 2 ? 'rd' : 'th'}`;
        const viewModes = viewMode === 'Sundays' ? label + ' Sunday' : 'Day';
        const formatDate = (date) => {
            const d = new Date(date);
            const day = d.getDate(); // No need to pad
            const month = d.toLocaleString('default', { month: 'long' }); // "July", "August", etc.
            return `${month} ${day} `;
        };
        return {
            key: idx,
            header: (
                <td key={`header-${idx}`}>
                    <b>{viewModes}<br /></b>
                    {formatDate(date)}
                </td>
            ),
            control: (
                <td key={`control-${idx}`}>
                    <div className={`center gap-1 ${attendance.length > 0 ? 'd-flex' : 'd-none'}`}>
                        <button type='button' className='btnEditAttendance badge btn btn-secondary btn-sm'>
                            Edit
                        </button>
                        <button type='button' className='btnCancelAttendance badge btn btn-danger btn-sm d-none'>
                            Cancel
                        </button>
                        <button type='button' className='btnSaveAttendance badge btn btn-success btn-sm d-none'>
                            Save
                        </button>
                    </div>
                </td>
            )
        };
    });

    const handleEditChurchgoer = (userID) => {
        churchgoers.forEach((churchgoer) => {
            if (churchgoer.id === userID) {
                // console.log(churchgoer);
                setUserData(churchgoer);
            }
        })
    }

    return (
        <div className="d-flex vh-100">
            <Sidebar />
            <div className="w-100 overflow-auto">
                <Header />
                <ChurchgoerModal userData={userData} />
                <div className='p-3'>
                    <h3 className="text-start">Attendance</h3>
                    <div className="card rounded-3 mt-3">
                        <div className="card-header">
                            <h4>
                                Church Attendance - {new Date(year, month).toLocaleString('default', { month: 'long' })} {year}
                            </h4>
                            <p className='m-0'>Easily check your attendance records here.</p>
                        </div>
                        <div className="card-body">
                            <div className='center flex-wrap gap-2 mb-3'>
                                <button type="button" className="btn btn-danger btnExportPDF">
                                    Export
                                </button>
                                <div>
                                    <div className="input-group center">
                                        <button type="button" className="btn btn-success btnAddChurch" data-bs-toggle="modal" data-bs-target="#addChurchgoerModal">
                                            Register
                                        </button>
                                        <button type="button" className="btn btn-secondary refreshAttendance d-none">
                                            Refresh
                                        </button>
                                        {/* Search Funtionality */}
                                        <input
                                            type="text"
                                            className="form-control searchChurchgoer"
                                            placeholder="Search name here..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            style={{ maxWidth: '340px' }}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex flex-wrap center gap-2">
                                    <div className="d-flex gap-2">
                                        <select
                                            className="form-select"
                                            value={viewMode}
                                            onChange={(e) => setViewMode(e.target.value)}
                                        >
                                            <option value="Sundays">Sundays</option>
                                            <option value="Weekdays">Weekdays</option>
                                        </select>
                                        <select className="form-select" style={{ width: '150px' }} value={month}
                                            onChange={e => setMonth(Number(e.target.value))}>
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                                            ))}
                                        </select>
                                        <input
                                            className='form-control'
                                            type="number"
                                            value={year}
                                            onChange={e => setYear(Number(e.target.value))}
                                            style={{ width: '100px' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover table-bordered text-center">
                                    <thead className='align-middle'>
                                        <tr>
                                            <th>UserID</th>
                                            <th style={{ cursor: 'pointer' }} >
                                                <div className='d-flex gap-3'>
                                                    <span className='me-auto' onClick={() =>
                                                        sortAttendanceBy('fullName', sortOrder, attendance, setSortOrder, setAttendance)}>
                                                        FullName {sortOrder === 'asc' ? '↑' : '↓'}</span>
                                                    <span className="material-symbols-outlined" onClick={formatByName}>
                                                        multiple_stop
                                                    </span>
                                                    <span className="material-symbols-outlined btnFilter" onClick={() =>
                                                        sortAttendanceBy('dateCreated', sortOrder, attendance, setSortOrder, setAttendance)}>
                                                        date_range
                                                    </span>
                                                </div>
                                            </th>
                                            {sundayColumns.map(col => col.header)}
                                        </tr>
                                        <tr>
<<<<<<< Updated upstream
                                            <th></th>
                                            <th></th>
                                            {sundayColumns.map(col => col.control)}
=======
                                            <th>
                                                <small>
                                                    <span>Total: {attendance.length}</span>
                                                </small>
                                            </th>
                                            <th>
                                                <small className='center'>
                                                    No Birthdate:
                                                    <span className={`material-symbols-outlined text-danger fs-5`}>
                                                        question_mark
                                                    </span>
                                                </small>
                                            </th>
                                            {attendanceTableColumn.map(col => col.control)}
>>>>>>> Stashed changes
                                        </tr>
                                    </thead>
                                    <tbody className='align-middle'>
                                        {attendance.length > 0 ? (
                                            attendance.filter(user =>
                                                user.fullName.toLowerCase().includes(searchTerm.trim().toLowerCase())
                                            ).map((user, userIdx) => (
                                                <tr key={userIdx}>
                                                    <td>{user.id}</td>
<<<<<<< Updated upstream
                                                    <td className="text-start center ps-3 " style={{ minWidth: '260px' }}>
                                                        <span className='me-auto'>{user.name}</span>
                                                        <button className='btn btn-secondary badge btnEditChurchgoer' type="button" onClick={() => handleEditChurchgoer(user.id)} data-bs-toggle="modal" data-bs-target="#addChurchgoerModal">Edit Info</button>
=======
                                                    <td className="text-start center" style={{ minWidth: '260px' }}>
                                                        <span className='me-auto text-capitalize fullName'>{user.fullName}</span>
                                                        <span className='me-auto text-capitalize formalName d-none'>{user.formalName}</span>
                                                        <span className={`material-symbols-outlined fs-5 me-2 ${user.dob === null ? 'text-danger' : 'd-none'}`}>
                                                            question_mark
                                                        </span>
                                                        <button className='btn btn-secondary badge btnEditChurchgoer' type="button"
                                                            onClick={() => handleEditChurchgoer(user.id)} data-bs-toggle="modal"
                                                            data-bs-target="#addChurchgoerModal">More...</button>
>>>>>>> Stashed changes
                                                    </td>

                                                    {sundays.map((date, sundayIdx) => (
                                                        <td key={sundayIdx}>
                                                            <div style={{ minWidth: '120px' }}>

                                                                <select user-data={`${user.id}|${sundayIdx + 1}|${date.toLocaleDateString('en-CA').replace(/-/g, '/')}`} className={`form-select form-select-sm d-none selectStatus${sundayIdx}`}>
                                                                    <option defaultValue="Visitor">Visitor</option>
                                                                    <option value="Present">Present</option>
                                                                    <option value="Absent">Absent</option>
                                                                    <option value="Excuse">Excuse</option>
                                                                </select>

                                                                <h6 className={`rounded text-light py-1 m-0 statusValue${sundayIdx}
                                                                    ${user.records[sundayIdx] === 'Present' ? 'bg-success' :
                                                                        user.records[sundayIdx] === 'Absent' ? 'bg-danger' :
                                                                            user.records[sundayIdx] === 'Excuse' ? 'bg-warning text-dark' : 'bg-secondary'}`} >
                                                                    {user.records[sundayIdx]}</h6>
                                                            </div>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={sundayColumns.length + 2}>No churchgoers found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewAttendance
