import React, { useState, useEffect, use } from 'react'
import ChurchgoerModal from './ChurchgoerModal';
import Axios from 'axios';
import { formatByName, sortAttendanceBy } from './SortAndFilter';
import editAttendance from './EditAttendance';
import { exportAttendanceToPDF } from './ExportAttendance';
import Swal from 'sweetalert2';
import { getUserToken } from '../accounts/GetUserToken';
import { formatDateOnly, formatFriendlyDate } from '../util/DateFomatter';

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

const ViewAttendance = () => {
    // 

    const url = 'http://localhost:5000/api';
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth());  // dynamically use current month
    const [year, setYear] = useState(today.getFullYear()); // dynamically use current yearx)
    const [sundays, setSundays] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [churchgoers, setChurchgoers] = useState([]);
    const [userData, setUserData] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('Sundays');
    const [printTheme, setPrintTheme] = useState('grid');

    const churchID = getUserToken().churchID;

    const refreshAttendance = () => {
        const sundaysInMonth = getDaysInMonthByType(year, month, viewMode);
        setSundays(sundaysInMonth); // ← Add this 
        Promise.all([
            Axios.post(`${url}/churchgoers`, { churchID: churchID }),
            Axios.get(`${url}/attendances`)
        ])
            .then(([churchgoersRes, attendanceRes]) => {
                const churchgoers = churchgoersRes.data;
                const attendances = attendanceRes.data;

                const userData = churchgoers.map(person => ({
                    name: `${person.firstName} ${person.lastName}`,
                    date: person.dateOfBirth,
                    role: person.ministry
                }));

                localStorage.setItem('churchgoers', JSON.stringify(userData));

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

                        return attendanceMap.get(key) || "--";
                    });

                    return {
                        id: person.id,
                        formalName: `${person.lastName}, ${person.firstName} ${person.middleName || ''}`.trim(),
                        fullName: `${person.firstName} ${person.middleName || ''} ${person.lastName}`.trim(),
                        dob: person.dateOfBirth,
                        records: personAttendance,
                        dateCreated: person.dateCreated
                    };
                });

                // Sort by name DESCENDING
                mapped.sort((a, b) => {
                    const dateA = a.dateCreated.toLowerCase();
                    const dateB = b.dateCreated.toLowerCase();

                    if (dateA > dateB) return -1;
                    if (dateA < dateB) return 1;
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
                        records: sundaysInMonth.map(() => '--'),
                    };
                }
                return user;
            })
        );
    }

    const setTheme = () => {
        const theme = localStorage.getItem('theme');
        const table = document.querySelector('.table');

        if (theme === 'light_mode') {
            table.classList.remove('table-dark');
            table.classList.add('table-body');

        } else if (theme === 'dark_mode') {
            table.classList.remove('table-body');
            table.classList.add('table-dark');
        }
    }

    useEffect(() => {
        refreshAttendance();
        document.querySelector('.searchChurchgoer').value = '';
        setSearchTerm('');
        setTheme();
    }, []);

    useEffect(() => {
        editAttendance();
        countAttendanceStatus();
    }, [attendance])

    // refresh attendance
    useEffect(() => {
        attendanceCheck();
        refreshAttendance();
    }, [year, month, viewMode]);

    const attendanceTableColumn = sundays.map((date, idx) => {
        const label = `${idx + 1}${idx === 0 ? 'st' : idx === 1 ? 'nd' : idx === 2 ? 'rd' : 'th'}`;
        const viewModes = viewMode === 'Sundays' ? label + ' Sunday' : 'Day';
        const formatDate = (date) => {
            const d = new Date(date);
            const day = d.getDate(); // No need to pad
            const month = d.toLocaleString('default', { month: 'short' }); // "July", "August", etc.
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
                        <div className={`d-flex gap-1 statusBadge${idx}`}>
                            <button type='button' className={`badgePresent${idx} badge btn btn-success btn-sm`}>0</button>
                            <button type='button' className={`badgeAbsent${idx} badge btn btn-danger btn-sm`}>0</button>
                            <button type='button' className={`badgeVisitor${idx} badge btn btn-secondary btn-sm`}>0</button>
                            <button type='button' className={`badgeExcuse${idx} badge btn btn-warning text-dark btn-sm`}>0</button>
                        </div>
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

    const countAttendanceStatus = () => {
        sundays.forEach((date, idx) => {
            const statusValue = document.querySelectorAll(`.statusValue${idx}`);
            let present = 0;
            let absent = 0;
            let visitor = 0;
            let excuse = 0;
            statusValue.forEach((status) => {
                switch (status.textContent) {
                    case 'Present':
                        present++;
                        break;
                    case 'Absent':
                        absent++;
                        break;
                    case 'Visitor':
                        visitor++;
                        break;
                    case 'Excuse':
                        excuse++;
                        break;
                }
            })
            document.querySelector(`.badgePresent${idx}`).textContent = "P" + present;
            document.querySelector(`.badgeAbsent${idx}`).textContent = "A" + absent;
            document.querySelector(`.badgeVisitor${idx}`).textContent = "V" + visitor;
            document.querySelector(`.badgeExcuse${idx}`).textContent = "E" + excuse;
        })
    }

    const sortName = () => {
        const btnFormatName = document.querySelector('.btnFormatName');
        if (btnFormatName.textContent === 'compare_arrows') {
            sortAttendanceBy("fullName", sortOrder, attendance, setSortOrder, setAttendance);
        } else {
            sortAttendanceBy("formalName", sortOrder, attendance, setSortOrder, setAttendance);
        }
    }

    const exportAttendance = () => {
        const data = {
            theme: printTheme,
            type: viewMode,
            churchLogo: '/cca.png',
            churchName: getUserToken().churchName,
            churchAddress: getUserToken().churchAddress,
            reportTitle: ` Attendance - ${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`,
            subText: 'Report Date: ' + new Date().toLocaleString('default', { month: 'long', day: '2-digit', year: 'numeric' }),
        }

        Swal.fire({
            text: 'Do you want to export Attendance to PDF?',
            icon: 'question',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No, cancel`,
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Exporting Attendance...',
                    icon: 'info',
                    timer: 2000,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                })
                exportAttendanceToPDF(data);
            }
        })


    }

    const handleRefresh = () => {

        attendanceCheck();
        refreshAttendance();
        Swal.fire({
            title: 'Please wait...',
            icon: 'info',
            timer: 2000,
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        })
    }

    const handleViewMode = () => {
        const btnListView = document.querySelector('.btnListView');
        btnListView.textContent = btnListView.textContent === 'List view' ? 'Back' : 'List view';
        const attendanceView = document.querySelector('.attendanceView');
        const listView = document.querySelector('.listView');
        attendanceView.classList.toggle('d-none');
        listView.classList.toggle('d-none');
    }

    return (
        <div className='p-3'>
            <ChurchgoerModal userData={userData} />
            <div className="card rounded-3">
                <div className="card-header center flex-column py-4">
                    <h4 className='attendanceTitle'>Attendance - {new Date(year, month).toLocaleString('default', { month: 'long' })} {year}  </h4>
                </div>
                <div className="card-body">
                    <div className='center flex-wrap gap-2 mb-3'>
                        <button type="button" className="btn btn-success btnAddChurch" data-bs-toggle="modal" data-bs-target="#addChurchgoerModal">
                            Register
                        </button>
                        <button type="button" className="btn btn-secondary btnListView" onClick={handleViewMode}>
                            List view
                        </button>
                        <div className='input-group' style={{ maxWidth: '165px' }}>
                            <button type="button" className="btn btn-secondary btnExport" onClick={exportAttendance}>
                                Export
                            </button>
                            <select className='form-select' value={printTheme} onChange={(e) => setPrintTheme(e.target.value)}>
                                <option value="grid">Grid</option>
                                <option value="striped">Stripe</option>
                                <option value="plain">Plain</option>
                            </select>
                        </div>
                        <div className="flex-wrap center gap-2 ms-auto">
                            <div>
                                <div className="input-group">
                                    <button type="button" className="btn btn-success refreshAttendance" onClick={handleRefresh}>
                                        Refresh
                                    </button>
                                    {/* Search Funtionality */}
                                    <input
                                        type="search"
                                        className="form-control searchChurchgoer"
                                        placeholder="Search name here..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        style={{ maxWidth: '340px' }}
                                    />
                                    <span className="input-group-text material-symbols-outlined searchIcon">search</span>
                                </div>
                            </div>
                            <div className="d-flex flex-wrap center gap-2">
                                <select
                                    className="form-select"
                                    value={viewMode} style={{ maxWidth: '124px' }}
                                    onChange={(e) => setViewMode(e.target.value)}
                                >
                                    <option value="Sundays">Sundays</option>
                                    <option value="Weekdays">Weekdays</option>
                                </select>
                                <select className="form-select" style={{ width: '140px' }} value={month}
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

                    <div className="table-responsive attendanceView">
                        <table className="table table-hover table-bordered table-dark text-center">
                            <thead className='align-middle'>
                                <tr>
                                    <th>UserID</th>
                                    <th style={{ cursor: 'pointer' }} >
                                        <div className='d-flex gap-3'>
                                            <span className='me-auto sortName' onClick={sortName}>
                                                FullName {sortOrder === 'desc' ? '↑' : '↓'}</span>
                                            <span className="material-symbols-outlined btnFormatName" onClick={formatByName}>
                                                compare_arrows
                                            </span>
                                            <span className="material-symbols-outlined btnFilter" onClick={() => sortAttendanceBy(
                                                "dateCreated", sortOrder, attendance, setSortOrder, setAttendance)}>
                                                date_range
                                            </span>
                                        </div>
                                    </th>
                                    {attendanceTableColumn.map(col => col.header)}
                                </tr>
                                <tr>
                                    <th></th>
                                    <th className='flex-between'>
                                        <small >Registered: {attendance.length}</small>
                                        <small className='center'>No Birthdate:
                                            <span className="material-symbols-outlined fs-5 text-danger">
                                                question_mark
                                            </span>
                                        </small>
                                    </th>
                                    {attendanceTableColumn.map(col => col.control)}
                                </tr>
                            </thead>
                            <tbody className='align-middle'>
                                {attendance.length > 0 ? (
                                    /* Search Funtionality */
                                    attendance.filter(user =>
                                        user.fullName.toLowerCase().includes(searchTerm.trim().toLowerCase())
                                    ).map((user, userIdx) => (
                                        <tr key={userIdx}>
                                            <td>{user.id}</td>
                                            <td className="text-start center" style={{ minWidth: '260px' }}>
                                                <span className='me-auto text-capitalize formatName fullName'>{user.fullName}</span>
                                                <span className='me-auto text-capitalize formatName formalName d-none'>{user.formalName}</span>

                                                {/* Show when no birthdate */}
                                                <span className={`material-symbols-outlined fs-5 text-danger me-3 ${user.dob ? 'd-none' : ''}`}>
                                                    question_mark
                                                </span>

                                                {/* More Buttons */}
                                                <button className='btn btn-secondary badge btnEditChurchgoer' type="button"
                                                    onClick={() => handleEditChurchgoer(user.id)} data-bs-toggle="modal"
                                                    data-bs-target="#addChurchgoerModal">More...</button>
                                            </td>
                                            {sundays.map((date, sundayIdx) => (
                                                <td key={sundayIdx}>
                                                    <div style={{ minWidth: '120px' }}>

                                                        {/* Show when edit button is clicked */}
                                                        <select user-data={`${user.id}|${sundayIdx + 1}|${date.toLocaleDateString('en-CA').replace(/-/g, '/')}`}
                                                            className={`form-select form-select-sm d-none selectStatus${sundayIdx}`}>
                                                            <option value="--" disabled>Select</option>
                                                            <option value="Visitor">Visitor</option>
                                                            <option value="Present">Present</option>
                                                            <option value="Absent">Absent</option>
                                                            <option value="Excuse">Excuse</option>
                                                        </select>

                                                        {/* Show Current Status */}
                                                        <p className={`rounded m-0 statusValue${sundayIdx}
                                                                    ${user.records[sundayIdx] === 'Present' ? `text-success` :
                                                                user.records[sundayIdx] === 'Absent' ? 'text-danger' :
                                                                    user.records[sundayIdx] === 'Excuse' ? 'text-warning' :
                                                                        user.records[sundayIdx] === 'Visitor' ? 'text-secondary' : ''}`} >
                                                            {user.records[sundayIdx]}</p>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={attendanceTableColumn.length + 2}>No churchgoers found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="table-responsive d-none listView">
                        <table className="table table-hover table-bordered table-dark">
                            <thead className='align-middle'>
                                <tr>
                                    <th>UserID</th>
                                    <th>Firstname</th>
                                    <th>Lastname</th>
                                    <th>Middle Name</th>
                                    <th>Gender</th>
                                    <th>Date of Birth</th>
                                    <th>Ministry</th>
                                    <th>Address</th>
                                    <th>Email</th>
                                    <th>Contact Number</th>
                                    <th>Date Registered</th>
                                </tr>
                            </thead>
                            <tbody className='align-middle'>
                                {churchgoers.length > 0 ? (
                                    /* Search Funtionality */
                                    churchgoers.filter(user =>
                                        user.firstName.toLowerCase().includes(searchTerm.trim().toLowerCase()) || user.lastName.toLowerCase().includes(searchTerm.trim().toLowerCase())
                                    ).map((user, userIdx) => (
                                        <tr key={userIdx} onClick={() => handleEditChurchgoer(user.id)} data-bs-toggle="modal"
                                            data-bs-target="#addChurchgoerModal">
                                            <td>{user.id}</td>
                                            <td>{user.firstName}</td>
                                            <td>{user.lastName}</td>
                                            <td>{user.middleName}</td>
                                            <td>{user.gender}</td>
                                            <td>{formatDateOnly(user.dateOfBirth)}</td>
                                            <td>{user.ministry}</td>
                                            <td>{user.address}</td>
                                            <td>{user.email}</td>
                                            <td>{user.contactNumber}</td>
                                            <td>{formatFriendlyDate(user.dateCreated)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={12}>No churchgoers found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewAttendance