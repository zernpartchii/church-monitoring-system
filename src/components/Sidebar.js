import { React, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { UserView } from './UserView';
function Sidebar() {

    // Example: toggle mode on button click
    useEffect(() => {
        toggleMode();
        UserView();
    }, []);

    const toggleMode = () => {
        const themeIcon = document.querySelector('.themeIcon');
        const themeTitle = document.querySelector('.themeTitle');
        const sidebar = document.querySelector('.sidebar');

        const table = document.querySelector('.table');

        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            localStorage.setItem('theme', 'light');

            document.body.classList.add('light');
            document.body.classList.remove('dark');

            sidebar.classList.remove('bg-dark');
            sidebar.classList.add('bg-light');

            themeTitle.textContent = 'Light Mode';
            themeIcon.textContent = 'light_mode';

            if (table) {
                table.classList.remove('table-dark');
                table.classList.add('table-body');
            }
        } else {
            localStorage.setItem('theme', 'dark'); // Default theme

            document.body.classList.remove('light');
            document.body.classList.add('dark');

            sidebar.classList.remove('bg-light');
            sidebar.classList.add('bg-dark');

            themeTitle.textContent = 'Dark Mode';
            themeIcon.textContent = 'dark_mode';

            if (table) {
                table.classList.remove('table-body');
                table.classList.add('table-dark');
            }
        }
    };

    const handleCloseSidebar = () => {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar.classList.contains('sidebarOpen')) {
            sidebar.classList.remove('sidebarOpen');
            sidebar.classList.add('sidebarClose');
        }
    };

    const handleSettings = () => {
        const settingDropdown = document.querySelector('.settingDropdown');
        settingDropdown.classList.toggle('d-none');
    };

    const handleLogout = () => {
        localStorage.removeItem('sidebarStatus');
    };

    return (
        <div className="card bg-light border-0 rounded-0 h-100 sidebar">
            <ul className="list-group list-group-flush">
                <li className="hover list-group-item closeSidebar" onClick={handleCloseSidebar}>
                    <span className="material-symbols-outlined text-danger">
                        x
                    </span>
                </li>
            </ul>
            <div className="card-header border-0 bg-transparent d-flex justify-content-center userLogo">
                <img src="../../cca.png" className="churchLogo" />
            </div>
            <div className="card-body p-0 mt-2 overflow-auto">
                <ul className="list-group list-group-flush h-100 d-flex gap-1 navlist userNav">
                    <Link to="/cms/dashboard" className="hover list-group-item">
                        <span className="material-symbols-outlined icon">
                            home
                        </span>
                        <p className="titleNav m-0">Dashboard</p>
                    </Link>
                    <Link to="/cms/attendance" className="hover list-group-item">
                        <span className="material-symbols-outlined icon">
                            groups
                        </span>
                        <p className="titleNav m-0">Attendance</p>
                    </Link>
                    <li className="hover list-group-item">
                        <span className="material-symbols-outlined icon">
                            calendar_month
                        </span>
                        <p className="titleNav m-0">Schedule</p>
                    </li>
                    <li className="hover list-group-item">
                        <span className="material-symbols-outlined icon">
                            event
                        </span>
                        <p className="titleNav m-0">Events</p>
                    </li>
                    <li className="hover list-group-item">
                        <span className="material-symbols-outlined icon">
                            demography
                        </span>
                        <p className="titleNav m-0">Reports</p>
                    </li>
                    <li className="hover list-group-item" onClick={handleSettings}>
                        <span className="material-symbols-outlined icon">
                            settings
                        </span>
                        <p className="titleNav m-0">Settings</p>
                    </li>
                    <ul className="list-group list-group-flush settingDropdown d-none">
                        <Link to="/cms/settings/account-info" className="hover ps-5 list-group-item">
                            <span className="material-symbols-outlined icon">
                                account_circle
                            </span>
                            <p className="titleNav m-0">Account Info</p>
                        </Link>
                        <li className="hover ps-5 list-group-item">
                            <span className="material-symbols-outlined icon">
                                manage_accounts
                            </span>
                            <p className="titleNav m-0">User Management</p>
                        </li>
                        <li className="hover ps-5 list-group-item">
                            <span className="material-symbols-outlined icon">
                                history_edu
                            </span>
                            <p className="titleNav m-0">History</p>
                        </li>
                    </ul>
                    <li className="hover list-group-item mt-auto" onClick={toggleMode}>
                        <span className="material-symbols-outlined icon themeIcon">
                            light_mode
                        </span>
                        <p className="titleNav themeTitle m-0">Light Mode</p>
                    </li>
                </ul>
                <ul className="list-group list-group-flush h-100 d-flex gap-1 navlist adminNav d-none">
                    <Link to="/cms/admin/dashboard" className="hover list-group-item">
                        <span className="material-symbols-outlined icon">
                            home
                        </span>
                        <p className="titleNav m-0">Dashboard</p>
                    </Link>
                    <Link to="/cms/admin/view-request" className="hover list-group-item">
                        <span className="material-symbols-outlined icon">
                            assignment_add
                        </span>
                        <p className="titleNav themeTitle m-0">View Request</p>
                    </Link>
                    <li className="hover list-group-item mt-auto" onClick={toggleMode}>
                        <span className="material-symbols-outlined icon themeIcon">
                            light_mode
                        </span>
                        <p className="titleNav themeTitle m-0">Light Mode</p>
                    </li>
                </ul>
            </div>
            <div className="card-footer p-0 pt-2">
                <ul className="list-group list-group-flush">
                    <Link to="/" className="hover list-group-item logout" onClick={handleLogout}>
                        <span className="material-symbols-outlined text-danger icon">
                            chip_extraction
                        </span>
                        <p className="titleNav m-0">Logout</p>
                    </Link>
                </ul>
            </div>
        </div>
    )
}
export default Sidebar
