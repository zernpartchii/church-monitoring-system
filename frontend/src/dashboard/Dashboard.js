import React, { useContext, useEffect } from 'react'
import Axios from 'axios'
import { countGroupsByAgeAndGender } from './GetChurchgoer'
import { generateChart } from './DashboardChart'
import { useState, useRef } from 'react'
import { getUserToken } from '../accounts/GetUserToken';
import BirthdayChart from './BirthdayChart';
const Dashboard = () => {

    const url = 'http://localhost:5000/api';
    const chartRef = useRef(null); // <--- Create the chart reference
    const [data, setData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // current month
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const churchID = getUserToken().churchID;

    useEffect(() => {
        Axios.post(`${url}/getAttendanceByChurch`, { churchID: churchID })
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
        Axios.post(`${url}/churchgoers`, { churchID: churchID })
            .then((response) => {
                const people = countGroupsByAgeAndGender(response.data);

                // console.table(response.data)

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
        <div className='p-3'>
            <h3 className="text-start">Dashboard</h3>
            <div className='d-flex flex-wrap gap-3'>
                {/* Member Card */}
                <div className="card text-white flex-fill border-0 bg-success">
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
                <div className="card text-white flex-fill border-0 bg-secondary">
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
                <div className="card text-white flex-fill border-0 bg-primary">
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
                <div className="card text-dark flex-fill border-0 bg-warning">
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

            <div className='d-flex flex-wrap gap-3 mt-3'>
                {/* Attendance Chart */}
                <div className='card p-3 flex-fill' style={{ height: "35vh", minWidth: "60%" }}>
                    <div className='d-flex justify-content-end input-group'>
                        <select
                            style={{ maxWidth: '8rem' }}
                            className='form-select border-0'
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        >
                            {monthOptions.map((m, i) => (
                                <option key={i} value={i + 1}>{m}</option>
                            ))}
                        </select>
                        <select
                            style={{ maxWidth: '6rem' }}
                            className='form-select border-0'
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                        >
                            {years.length === 0 ? <option>Year</option> :
                                years.map((y, i) => (
                                    <option key={i} value={y}>{y}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className='center h-100'>
                        <canvas ref={chartRef} id="attendanceChart"></canvas>
                    </div>
                </div>
                {/* Birthdate Chart */}
                <div className='card p-3 flex-fill' style={{ height: "35vh", minWidth: "39%" }}>
                    <BirthdayChart />
                </div>
            </div>

        </div>
    )
}

export default Dashboard
