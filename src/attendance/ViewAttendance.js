import React, { useState, useEffect, use } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import ChurchgoerModal from './ChurchgoerModal';
import Attendance from './Attendance';
import Axios from 'axios';
import Swal from 'sweetalert2';

const getSundaysInMonth = (year, month) => {
    const sundays = [];
    const date = new Date(year, month, 1);

    while (date.getMonth() === month) {
        if (date.getDay() === 0) {
            sundays.push(new Date(date));
        }
        date.setDate(date.getDate() + 1);
    }

    return sundays;
};

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
    const [attendance, setAttendance] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('Sundays');

    const sortAttendanceByName = () => {
        const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
        const sorted = [...attendance].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();

            if (nameA < nameB) return newOrder === 'desc' ? -1 : 1;
            if (nameA > nameB) return newOrder === 'desc' ? 1 : -1;
            return 0;
        });

        setSortOrder(newOrder);
        setAttendance(sorted);
    };

    const sortAttendanceByDate = () => {
        const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
        const sorted = [...attendance].sort((a, b) => {
            const dateA = a.dateCreated.toLowerCase();
            const dateB = b.dateCreated.toLowerCase();

            if (dateA < dateB) return newOrder === 'desc' ? -1 : 1;
            if (dateA > dateB) return newOrder === 'desc' ? 1 : -1;
            return 0;
        });

        setSortOrder(newOrder);
        setAttendance(sorted);
    };

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
                        name: `${person.lastName}, ${person.firstName} ${person.middleName || ''}`.trim(),
                        records: personAttendance,
                        dateCreated: person.dateCreated
                    };
                });

                // Sort by name DESCENDING
                mapped.sort((a, b) => {
                    const nameA = a.dateCreated.toLowerCase();
                    const nameB = b.dateCreated.toLowerCase();
                    if (nameA > nameB) return -1;
                    if (nameA < nameB) return 1;
                    return 0;
                });

                setAttendance(mapped);
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


    const editAttendance = () => {
        const btnEdit = document.querySelectorAll('.btnEditAttendance');
        const btnCancelAttendance = document.querySelectorAll('.btnCancelAttendance');
        const btnSaveAttendance = document.querySelectorAll('.btnSaveAttendance');
        btnEdit.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const sundayIdx = document.querySelectorAll(`.sundayIdx${index}`);
                sundayIdx.forEach((sunday, sundayIndex) => {
                    // console.log(sunday.value)
                    sunday.removeAttribute('disabled');
                })
                btnSaveAttendance[index].removeAttribute('disabled');
                btnCancelAttendance[index].classList.remove('d-none');
                btnEdit[index].classList.add('d-none');
            })
        })
        btnCancelAttendance.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const sundayIdx = document.querySelectorAll(`.sundayIdx${index}`);
                sundayIdx.forEach((sunday, sundayIndex) => {
                    // console.log(sunday.value)
                    sunday.setAttribute('disabled', 'true');
                })
                refreshAttendance();
                btn.classList.add('d-none');
                btnEdit[index].classList.remove('d-none');
            })
        })
        btnSaveAttendance.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const data = [];
                const sundayIdx = document.querySelectorAll(`.sundayIdx${index}`);
                sundayIdx.forEach((sunday, sundayIndex) => {
                    // console.log(sunday.value)
                    const [userID, service, date, attendanceStatusValue] = sunday.value.split('|');
                    data.push({ userID, service, date, status: attendanceStatusValue });
                    sunday.setAttribute('disabled', 'true');
                })

                console.log(data)

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
                btn.setAttribute('disabled', 'true');
                btnEdit[index].classList.remove('d-none');
                btnCancelAttendance[index].classList.add('d-none');
            })
        })
    }

    const toggleAttendance = (userIdx, sundayIdx) => {
        setAttendance(prev => {
            const updated = [...prev];
            const current = updated[userIdx].records[sundayIdx];

            let nextStatus;
            if (current === "Visitor") nextStatus = 'Absent';
            else if (current === 'Absent') nextStatus = 'Present';
            else nextStatus = "Visitor";

            updated[userIdx].records[sundayIdx] = nextStatus;
            return updated;
        });
    };

    const sundayColumns = sundays.map((date, idx) => {
        const label = `${idx + 1}${idx === 0 ? 'st' : idx === 1 ? 'nd' : idx === 2 ? 'rd' : 'th'}`;
        const viewModes = viewMode === 'Sundays' ? label + ' Sunday' : 'Day';
        const formatDate = (date) => {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const year = d.getFullYear();
            return `${day}//${month}//${year}`;
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
                    <div className='center gap-1'>
                        <button type='button' className='btnEditAttendance badge btn btn-secondary btn-sm'>
                            Edit
                        </button>
                        <button type='button' className='btnCancelAttendance badge btn btn-danger btn-sm d-none'>
                            Cancel
                        </button>
                        <button type='button' className='btnSaveAttendance badge btn btn-success btn-sm' disabled>
                            Save
                        </button>
                    </div>
                </td>
            )
        };
    });

    return (
        <div className="d-flex vh-100">
            <Sidebar />
            <div className="w-100 overflow-auto">
                <Header />
                <Attendance />
                <div className='p-3'>
                    <h3 className="text-start">Attendance</h3>
                    <div className="card rounded-3 mt-3">
                        <div className="card-header">
                            <h5>View Attendance</h5>
                            <p>Easily check your attendance records here.</p>
                        </div>
                        <div className="card-body p-3">
                            <h4 className="text-center mb-3">Church Attendance - {new Date(year, month).toLocaleString('default', { month: 'long' })} {year}</h4>

                            <div className='flex-wrap center gap-2 mb-3'>
                                <div className="d-flex flex-wrap center gap-2">
                                    <button type="button" className="btn btn-secondary refreshAttendance d-none">
                                        Refresh
                                    </button>
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
                                <div className="input-group center">
                                    <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addChurchgoerModal">
                                        Add
                                    </button>
                                    {/* Search Funtionality */}
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search name here..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        style={{ maxWidth: '340px' }}
                                    />
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover table-bordered text-center">
                                    <thead className='align-middle'>
                                        <tr>
                                            <th>UserID</th>
                                            <th style={{ cursor: 'pointer' }} >
                                                <div className='d-flex px-2'>
                                                    <span className='me-auto' onClick={sortAttendanceByName}>FullName {sortOrder === 'asc' ? '↑' : '↓'}</span>
                                                    <span class="material-symbols-outlined btnFilter" onClick={sortAttendanceByDate}>
                                                        date_range
                                                    </span>
                                                </div>
                                            </th>
                                            {sundayColumns.map(col => col.header)}
                                        </tr>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            {sundayColumns.map(col => col.control)}
                                        </tr>
                                    </thead>
                                    <tbody className='align-middle'>
                                        {attendance.filter(user =>
                                            user.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
                                        ).map((user, userIdx) => (
                                            <tr key={userIdx}>
                                                <td>{user.id}</td>
                                                <td className="text-start center ps-3 " style={{ minWidth: '200px' }}>
                                                    <span className='me-auto'>{user.name}</span>
                                                    <button className='btn btn-secondary badge btnEditChurchgoer' data-bs-toggle="modal" data-bs-target="#addChurchgoerModal">Edit</button>
                                                </td>

                                                {sundays.map((date, sundayIdx) => (
                                                    <td key={sundayIdx}>
                                                        <div className='center gap-3' style={{ minWidth: '150px' }}>
                                                            <input
                                                                type="checkbox" disabled
                                                                className={`form-check-input border m-0 attendanceStatus sundayIdx${sundayIdx} 
                                                                        ${user.records[sundayIdx] === 'Present'
                                                                        ? 'bg-success border-success'
                                                                        : user.records[sundayIdx] === 'Absent'
                                                                            ? 'border-danger'
                                                                            : 'border-secondary'}`}
                                                                style={{ padding: '10px' }}
                                                                id={`attendance-${userIdx}${sundayIdx}`}
                                                                checked={user.records[sundayIdx] === 'Present'}
                                                                onChange={() => toggleAttendance(userIdx, sundayIdx)}
                                                                value={`${user.id}|${sundayIdx + 1}|${date.toLocaleDateString('en-CA').replace(/-/g, '/')}|${user.records[sundayIdx] === 'Visitor'
                                                                    ? 'Visitor' // leave label empty until clicked
                                                                    : user.records[sundayIdx]}`}
                                                            />

                                                            <label htmlFor={`attendance-${userIdx}${sundayIdx}`}
                                                                className={`ms-2 ${user.records[sundayIdx] === 'Present'
                                                                    ? 'text-success'
                                                                    : user.records[sundayIdx] === 'Visitor'
                                                                        ? 'text-secondary'
                                                                        : 'text-danger'
                                                                    }`}>
                                                                {user.records[sundayIdx] === 'Visitor'
                                                                    ? 'Visitor' // leave label empty until clicked
                                                                    : user.records[sundayIdx]}
                                                            </label>


                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ChurchgoerModal />
        </div>
    )
}

export default ViewAttendance
