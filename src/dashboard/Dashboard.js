import React, { useContext, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Axios from 'axios'
import { countGroupsByAgeAndGender } from './GetChurchgoer'
import { generateChart } from './DashboardChart'
import { useState, useRef } from 'react'
const Dashboard = () => {

    const chartRef = useRef(null); // <--- Create the chart reference
    const [data, setData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // current month
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const token = localStorage.getItem('cmsUserToken');
        const payload = JSON.parse(atob(token.split('.')[1]));
        const churchID = payload.churchID;

        Axios.post('http://localhost:5000/api/getAttendanceByChurch', { churchID: churchID })
            .then((response) => {
                // console.log(response.data)
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            })

        countMembers(churchID);
        generateChart(data, selectedMonth, selectedYear);

    }, []);

    useEffect(() => {
        generateChart(chartRef, data, selectedMonth, selectedYear,);
    }, [data, selectedMonth, selectedYear]);

    const countMembers = (churchID) => {
        Axios.post('http://localhost:5000/api/churchgoers', { churchID: churchID })
            .then((response) => {
                const people = countGroupsByAgeAndGender(response.data);

                // console.log(response.data)

                document.querySelector('.maleMember').textContent = people.Male;
                document.querySelector('.femaleMember').textContent = people.Female;
                document.querySelector('.totalMember').textContent = people.Male + people.Female;

                document.querySelector('.totalYouth').textContent = people.Youth.Male + people.Youth.Female;
                document.querySelector('.maleYouth').textContent = people.Youth.Male;
                document.querySelector('.femaleYouth').textContent = people.Youth.Female;

                document.querySelector('.totalAdult').textContent = people.Adult.Male + people.Adult.Female;
                document.querySelector('.maleAdult').textContent = people.Adult.Male;
                document.querySelector('.femaleAdult').textContent = people.Adult.Female;

                document.querySelector('.totalSenior').textContent = people.Senior.Male + people.Senior.Female;
                document.querySelector('.maleSenior').textContent = people.Senior.Male;
                document.querySelector('.femaleSenior').textContent = people.Senior.Female;
            })
    }

    const monthOptions = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const getUniqueYears = (data) => {
        const years = data.map(d => new Date(d.date).getFullYear());
        return Array.from(new Set(years)).sort((a, b) => b - a); // descending
    };

    const years = getUniqueYears(data);

    return (
        <div className="d-flex vh-100">
            <Sidebar />
            <div className="w-100 overflow-auto">
                <Header />
                <div className='p-3'>
                    <h3 className="text-start">Dashboard</h3>
                    <div className='d-flex flex-wrap gap-3'>
                        {/* Member Card */}
                        <div className="card text-white border-0 flex-fill bg-success" style={{ maxWidth: "50rem" }}>
                            <div className="card-body flex-between">
                                <div className='d-flex align-items-center flex-column'>
                                    <h1 className="card-title totalMember">0</h1>
                                    <p className="card-text fw-bold">Member</p>
                                </div>
                                <span className="material-symbols-outlined" style={{ fontSize: "70px" }}>
                                    groups_2
                                </span>
                            </div>
                            <div className='card-footer d-flex gap-3'>
                                <div className='d-flex align-items-center'>
                                    <p className="card-text m-0 me-1">Male: </p>
                                    <h1 className="card-title fw-bold m-0 fs-6 maleMember">0</h1>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <p className="card-text m-0 me-1">Female: </p>
                                    <h1 className="card-title fw-bold m-0 fs-6 femaleMember">0</h1>
                                </div>
                            </div>
                        </div>
                        {/* Youth Card */}
                        <div className="card text-white border-0 flex-fill bg-secondary" style={{ maxWidth: "50rem" }}>
                            <div className="card-body flex-between">
                                <div className='d-flex align-items-center flex-column'>
                                    <h1 className="card-title totalYouth">0</h1>
                                    <p className="card-text fw-bold">Youth</p>
                                </div>
                                <span className="material-symbols-outlined" style={{ fontSize: "70px" }}>
                                    diversity_3
                                </span>
                            </div>
                            <div className='card-footer d-flex gap-3'>
                                <div className='d-flex align-items-center'>
                                    <p className="card-text m-0 me-1">Male: </p>
                                    <h1 className="card-title fw-bold m-0 fs-6 maleYouth">0</h1>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <p className="card-text m-0 me-1">Female: </p>
                                    <h1 className="card-title fw-bold m-0 fs-6 femaleYouth">0</h1>
                                </div>
                            </div>
                        </div>
                        {/* Adult Card */}
                        <div className="card text-white border-0 flex-fill bg-primary" style={{ maxWidth: "50rem" }}>
                            <div className="card-body flex-between">
                                <div className='d-flex align-items-center flex-column'>
                                    <h1 className="card-title totalAdult">0</h1>
                                    <p className="card-text fw-bold">Adult</p>
                                </div>
                                <span className="material-symbols-outlined" style={{ fontSize: "70px" }}>
                                    wc
                                </span>
                            </div>
                            <div className='card-footer d-flex gap-3'>
                                <div className='d-flex align-items-center'>
                                    <p className="card-text m-0 me-1">Male: </p>
                                    <h1 className="card-title fw-bold m-0 fs-6 maleAdult">0</h1>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <p className="card-text m-0 me-1">Female: </p>
                                    <h1 className="card-title fw-bold m-0 fs-6 femaleAdult">0</h1>
                                </div>
                            </div>
                        </div>
                        {/* Senior Card */}
                        <div className="card text-dark border-0 flex-fill bg-warning" style={{ maxWidth: "50rem" }}>
                            <div className="card-body flex-between">
                                <div className='d-flex align-items-center flex-column'>
                                    <h1 className="card-title totalSenior">0</h1>
                                    <p className="card-text fw-bold">Senior</p>
                                </div>
                                <span className="material-symbols-outlined" style={{ fontSize: "70px" }}>
                                    elderly_woman
                                </span>
                            </div>
                            <div className='card-footer d-flex gap-3'>
                                <div className='d-flex align-items-center'>
                                    <p className="card-text m-0 me-1">Male: </p>
                                    <h1 className="card-title fw-bold m-0 fs-6 maleSenior">0</h1>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <p className="card-text m-0 me-1">Female: </p>
                                    <h1 className="card-title fw-bold m-0 fs-6 femaleSenior">0</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='card p-3 mt-3' style={{ maxWidth: "50rem" }}>
                        <div className='center input-group'>
                            <select style={{ maxWidth: '8rem' }} className='form-select' value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                                {monthOptions.map((m, i) => (
                                    <option key={i} value={i + 1}>{m}</option>
                                ))}
                            </select>
                            <select style={{ maxWidth: '6rem' }} className='form-select' value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                                {years.length === 0 ? <option>Year</option> :
                                    years.map((y, i) => (
                                        <option key={i} value={y}>{y}</option>
                                    ))
                                }
                            </select>
                        </div>
                        {/* <h5 className='text-center mt-3 m-0'>Attendance Summary</h5> */}
                        <div className='center' style={{ height: "35vh" }}>
                            <canvas ref={chartRef} id="attendanceChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
