import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { formatDateShort } from '../util/DateFomatter';
Chart.register(ChartDataLabels);

// Global chart instance
let chartInstance = null;

export const generateChart = (chartRef, rawData, selectedMonth, selectedYear) => {

    if (chartInstance) {
        chartInstance.destroy(); // destroy previous instance before creating new one
    }

    if (!chartRef.current) return;

    const filteredData = rawData.filter(({ date }) => {
        const d = new Date(date);
        return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
    });


    if (filteredData.length === 0) {
        const canvas = chartRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '26px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'start';
        ctx.fillText('Attendance Chart', 50, 60);
        return;
    }

    // Group and count by date and status
    const grouped = {};
    filteredData.forEach(({ date, status }) => {
        const d = new Date(date).toLocaleDateString('en-CA').split('T')[0];
        if (!grouped[d]) grouped[d] = { Present: 0, Absent: 0, Excuse: 0, Visitor: 0 };
        grouped[d][status] = (grouped[d][status] || 0) + 1;
    });

    const labels = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
    const statuses = ['Present', 'Absent', 'Excuse', 'Visitor'];

    const colorMap = {
        Present: 'rgba(25, 135, 84, 0.7)',     // Bootstrap success (green)
        Absent: 'rgba(220, 53, 69, 0.7)',      // Bootstrap danger (red)
        Excuse: 'rgba(255, 193, 7, 0.7)',      // Bootstrap warning (yellow)
        Visitor: 'rgba(108, 117, 125, 0.7)'    // Bootstrap secondary (gray)
    };

    const borderColorMap = {
        Present: 'rgba(25, 135, 84, 1)',
        Absent: 'rgba(220, 53, 69, 1)',
        Excuse: 'rgba(255, 193, 7, 1)',
        Visitor: 'rgba(108, 117, 125, 1)'
    };

    const datasets = statuses.map(status => ({
        label: status,
        data: labels.map(label => grouped[label][status] || 0),
        backgroundColor: colorMap[status],
        // borderColor: borderColorMap[status],
        borderWidth: 1,
        borderRadius: 5 // ✅ Rounded corners (adjust as needed)
    }));

    const allValues = datasets.flatMap(d => d.data);
    const maxValue = Math.max(...allValues);
    const yAxisMax = maxValue + 2;

    const ctx = document.getElementById('attendanceChart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(label => formatDateShort(label)),
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Attendance Summary',
                    font: { size: 14, weight: 'bold' }, // ✅ Set title font size here
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
                    formatter: (value) => value == 0 ? '' : value
                }
            },
            scales: {
                x: {
                    stacked: false,
                    barThickness: 100,             // Fixed thickness (in pixels) of each bar
                    maxBarThickness: 100,          // Maximum bar thickness (used when barThickness not set)
                    categoryPercentage: 0.8,
                    barPercentage: 0.9,
                    ticks: {
                        display: true,          // ✅ force display labels
                        autoSkip: false,        // ✅ don't skip labels even if many
                        color: '#666'
                    },  // optional: white text for dark background
                    grid: { display: false },        // optional: hide vertical grid lines

                },
                y: {
                    stacked: false,
                    beginAtZero: true,
                    max: yAxisMax, // or just a little higher than your max data value
                    ticks: { color: '#666' },  // optional: white text for dark background
                    grid: { display: true },        // optional: hide horizontal grid lines
                }
            }
        },
        plugins: [ChartDataLabels]  // ✅ Register plugin here
    });
}