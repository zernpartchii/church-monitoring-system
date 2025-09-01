import { React, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom';
import { UserView } from './UserView';
const Sidebar = () => {

    const setTheme = () => {
        const themeIcon = document.querySelector('.themeIcon');
        const themeTitle = document.querySelector('.themeTitle');
        const sidebar = document.querySelector('.sidebar');
        const table = document.querySelectorAll('.table');
        const theme = localStorage.getItem('theme');

        if (theme === 'light_mode') {
            document.body.classList.add('light');
            document.body.classList.remove('dark');

            sidebar.classList.remove('sideBarDark');
            sidebar.classList.add('bg-light');

            themeTitle.textContent = 'Light Mode';
            themeIcon.textContent = 'light_mode';

            if (table) {
                table.forEach(t => {
                    t.classList.remove('table-dark');
                    t.classList.add('table-body');
                });
            }
        } else if (theme === 'dark_mode') {
            document.body.classList.remove('light');
            document.body.classList.add('dark');

            sidebar.classList.remove('bg-light');
            sidebar.classList.add('sideBarDark');

            themeTitle.textContent = 'Dark Mode';
            themeIcon.textContent = 'dark_mode';

            if (table) {
                table.forEach(t => {
                    console.log(t);
                    t.classList.remove('table-body');
                    t.classList.add('table-dark');
                });
            }
        }
    }

    const toggleMode = () => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark_mode') {
            localStorage.setItem('theme', 'light_mode');
        } else {
            localStorage.setItem('theme', 'dark_mode');
        }
        setTheme();
    };

    // Example: toggle mode on button click
    useEffect(() => {
        setTheme();
        UserView();
        handleClick();
    }, []);

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
        localStorage.removeItem('cmsUserToken');
        localStorage.removeItem('churchgoers');
        document.body.classList.remove('dark');
    };

    const handleClick = () => {
        const featured = document.querySelectorAll('.featured');
        featured.forEach(h => {
            h.addEventListener('click', () => {
                if (window.innerWidth <= 500) {
                    handleCloseSidebar();
                }
            });
        });
    }

    return (
        <div className="card bg-light border-0 rounded-0 h-100 sidebar">
            <div className="card-header border-0 bg-transparent gap-2 d-flex align-content-center userLogo">
                <img src="../../cca.png" className="churchLogo" />
            </div>
            <div className="card-body p-0 mt-2 overflow-auto">
                <ul className="list-group list-group-flush h-100 d-flex gap-1 navlist userNav">
                    <NavLink to="/cms/dashboard" className="hover featured list-group-item">
                        <span className="material-symbols-outlined icon">
                            home
                        </span>
                        <p className="titleNav m-0">Dashboard</p>
                    </NavLink>
                    <NavLink to="/cms/attendance" className="hover featured list-group-item">
                        <span className="material-symbols-outlined icon">
                            groups
                        </span>
                        <p className="titleNav m-0">Attendance</p>
                    </NavLink>
                    <NavLink to="/cms/schedule" className="hover featured list-group-item">
                        <span className="material-symbols-outlined icon">
                            calendar_month
                        </span>
                        <p className="titleNav m-0">Schedule Event</p>
                    </NavLink>
                    <hr />
                    <p className='m-0 ms-4' style={{ fontSize: '12px' }}>This feature is still under development.</p>
                    <li className="hover list-group-item">
                        <span className="material-symbols-outlined icon">
                            demography
                        </span>
                        <p className="titleNav m-0">Reports</p>
                    </li>
                    <li className="hover list-group-item">
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
