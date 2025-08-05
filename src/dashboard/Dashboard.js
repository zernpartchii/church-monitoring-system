import React, { useContext, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import GetChurchgoer, { countGroupsByAgeAndGender } from './GetChurchgoer'
import Axios from 'axios'
const Dashboard = () => {

    useEffect(() => {
        const token = localStorage.getItem('cmsUserToken');
        const payload = JSON.parse(atob(token.split('.')[1]));

        Axios.post('http://localhost:5000/api/churchgoers', { churchID: payload.churchID })
            .then((response) => {
                const people = countGroupsByAgeAndGender(response.data);

                document.querySelector('.maleTitle').textContent = people.Youth.Male + people.Adult.Male + people.Senior.Male;
                document.querySelector('.femaleTitle').textContent = people.Youth.Female + people.Adult.Female + people.Senior.Female;

                document.querySelector('.youthTitle').textContent = people.Youth.Male + people.Youth.Female;
                document.querySelector('.adultTitle').textContent = people.Adult.Male + people.Adult.Female;
                document.querySelector('.seniorTitle').textContent = people.Senior.Male + people.Senior.Female;
            })
    }, []);

    return (
        <div className="d-flex vh-100">
            <Sidebar />
            <div className="w-100 overflow-auto">
                <Header />
                <GetChurchgoer />
                <div className='p-3'>
                    <h3 className="text-start">Dashboard</h3>
                    <div className='d-flex flex-wrap gap-3'>
                        <div className="card text-white border-0 flex-fill bg-danger" style={{ minWidth: "15rem", maxWidth: "50rem" }}>
                            <div className="card-body flex-between">
                                <div>
                                    <h1 className="card-title maleTitle">14</h1>
                                    <p className="card-text fw-bold">Male</p>
                                </div>
                                <span className="material-symbols-outlined" style={{ fontSize: "70px" }}>
                                    boy
                                </span>
                            </div>
                        </div>
                        <div className="card text-white border-0 flex-fill bg-success" style={{ minWidth: "15rem", maxWidth: "50rem" }}>
                            <div className="card-body flex-between">
                                <div>
                                    <h1 className="card-title femaleTitle">23</h1>
                                    <p className="card-text fw-bold">Female</p>
                                </div>
                                <span className="material-symbols-outlined" style={{ fontSize: "70px" }}>
                                    girl
                                </span>
                            </div>
                        </div>
                        <div className="card text-white border-0 flex-fill bg-secondary" style={{ minWidth: "15rem", maxWidth: "50rem" }}>
                            <div className="card-body flex-between">
                                <div>
                                    <h1 className="card-title youthTitle">23</h1>
                                    <p className="card-text fw-bold">Youth</p>
                                </div>
                                <span className="material-symbols-outlined" style={{ fontSize: "70px" }}>
                                    diversity_3
                                </span>
                            </div>
                        </div>
                        <div className="card text-white border-0 flex-fill bg-primary" style={{ minWidth: "15rem", maxWidth: "50rem" }}>
                            <div className="card-body flex-between">
                                <div>
                                    <h1 className="card-title adultTitle">23</h1>
                                    <p className="card-text fw-bold">Adult</p>
                                </div>
                                <span className="material-symbols-outlined" style={{ fontSize: "70px" }}>
                                    wc
                                </span>
                            </div>
                        </div>
                        <div className="card text-dark border-0 flex-fill bg-warning" style={{ minWidth: "15rem", maxWidth: "50rem" }}>
                            <div className="card-body flex-between">
                                <div>
                                    <h1 className="card-title seniorTitle">23</h1>
                                    <p className="card-text fw-bold">Senior</p>
                                </div>
                                <span className="material-symbols-outlined" style={{ fontSize: "70px" }}>
                                    elderly_woman
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
