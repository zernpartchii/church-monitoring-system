import { React, useEffect } from 'react'
import { getUserToken } from '../accounts/GetUserToken';
const Header = () => {

    const handleResize = () => {
        const sidebar = document.querySelector('.sidebar');
        const screenWidth = window.innerWidth;
        if (sidebar) {
            if (screenWidth <= 500) {
                sidebar.classList.add('mobileNav', 'sidebarClose');
            } else {
                sidebar.classList.remove('mobileNav');
                const sidebarStatus = localStorage.getItem('sidebarStatus');
                if (sidebarStatus === 'close') {
                    sidebar.classList.remove('sidebarOpen');
                    sidebar.classList.add('sidebarClose');
                } else {
                    sidebar.classList.add('sidebarOpen');
                    sidebar.classList.remove('sidebarClose');
                }
            }
        }
    };

    useEffect(() => {
        const churchName = document.querySelector('.topbarTitle');
        churchName.textContent = getUserToken().churchName;

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    const handleMenuToggle = () => {
        const sidebar = document.querySelector('.sidebar');
        const menu = document.querySelector('.menu');
        menu.textContent == 'left_panel_close' ? menu.textContent = 'left_panel_open' : menu.textContent = 'left_panel_close';
        if (sidebar.classList.contains('sidebarClose')) {
            sidebar.classList.remove('sidebarClose');
            sidebar.classList.add('sidebarOpen');
            localStorage.setItem('sidebarStatus', 'open');
        } else {
            sidebar.classList.remove('sidebarOpen');
            sidebar.classList.add('sidebarClose');
            localStorage.setItem('sidebarStatus', 'close');
        }
    };
    return (
        <div className='p-2 sticky-top topbar '>
            <div className=' center gap-2 px-2 topNav my-2'>
                <span className="material-symbols-outlined cursor menu" onClick={handleMenuToggle}>
                    left_panel_close
                </span>
                <div className="center gap-2 flex-wrap me-auto">
                    <div className='userTopLogo'>
                        <img src="../../cca.png" className="churchLogoMobile" />
                    </div>
                    <p className="text-center fs-5 m-0 topbarTitle"></p>
                </div>
            </div>
            <hr className='m-0' />
        </div>
    )
}

export default Header
