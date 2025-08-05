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

const ViewAttendance = () => {
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

        const token = localStorage.getItem('cmsUserToken');
        const payload = JSON.parse(atob(token.split('.')[1]));

        Promise.all([
            Axios.post('http://localhost:5000/api/churchgoers', { churchID: payload.churchID }),
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

                    console.log(dateA, dateB);
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
                                <button type="button" className="btn btn-danger btnExport">
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
                                                    <span className='me-auto' onClick={() => sortAttendanceBy(
                                                        "fullName", sortOrder, attendance, setSortOrder, setAttendance)}>
                                                        FullName {sortOrder === 'asc' ? '↑' : '↓'}</span>
                                                    <span className="material-symbols-outlined" onClick={formatByName}>
                                                        multiple_stop
                                                    </span>
                                                    <span className="material-symbols-outlined btnFilter" onClick={() => sortAttendanceBy(
                                                        "formalName", sortOrder, attendance, setSortOrder, setAttendance)}>
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
                                                    <span class="material-symbols-outlined fs-5 text-danger">
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
                                                        <span className='me-auto text-capitalize fullName'>{user.fullName}</span>
                                                        <span className='me-auto text-capitalize formalName d-none'>{user.formalName}</span>

                                                        {/* Show when no birthdate */}
                                                        <span class={`material-symbols-outlined fs-5 text-danger me-3 ${user.dob ? 'd-none' : ''}`}>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewAttendance