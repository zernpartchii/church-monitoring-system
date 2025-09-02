import React from "react";
import { Bar } from "react-chartjs-2";
import { getUserToken } from '../accounts/GetUserToken';
import Axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BirthdayChart = () => {

    const url = 'http://localhost:5000/api';
    const churchID = getUserToken().churchID;
    Axios.post(`${url}/churchgoers`, { churchID: churchID })
        .then(response => {
            const churchgoers = response.data;
            const userData = churchgoers.map(person => ({
                name: `${person.firstName} ${person.lastName}`,
                date: person.dateOfBirth,
                role: person.ministry
            }));

            localStorage.setItem('churchgoers', JSON.stringify(userData));
        })
        .catch(error => {
            console.error("There was an error fetching the churchgoers data!", error);
        });

    const userData = JSON.parse(localStorage.getItem('churchgoers')) || [];
    const churchgoers = userData.map(person => ({
        dateOfBirth: person.date,
    }));

    // Months order
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Count birthdays per month
    const monthCounts = months.map(month => {
        return churchgoers.filter(person => {
            if (!person.dateOfBirth) return false;
            const date = new Date(person.dateOfBirth);
            return months[date.getMonth()] === month;
        }).length;
    });

    // Chart data
    const data = {
        labels: months.map(month => `${month.length > 3 ? month.slice(0, 3) : month}`),
        datasets: [
            {
                label: "Number of Birthdays",
                data: monthCounts,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }
        ]
    };

    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: "Birthdays by Month"
            },
            legend: {
                display: false
            },
            datalabels: {
                display: true,               // ✅ ensure it's turned ON
                anchor: 'end',
                align: 'top',     // ✅ Place above the bar
                color: '#666',      // ✅ Neutral color for both dark/light
                font: {
                    weight: 'bold',
                    size: 12
                },
                // formatter: (value) => value == 0 ? '' : value
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: Math.max(...monthCounts) + 1 // Add offset of 1 units
            }
        }
    };

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <Bar data={data} options={options} />
        </div>
    )
}

export default BirthdayChart
