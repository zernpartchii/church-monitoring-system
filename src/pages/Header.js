import React from 'react'
import { Link } from 'react-router-dom'
const Header = () => {

    const handleMenu = () => {
        const navList = document.querySelector('.nav-list');
        const menu = document.querySelector('.landingPageMenu');
        menu.textContent == 'menu' ? menu.textContent = 'close' : menu.textContent = 'menu';
        navList.classList.toggle('active');
    }

    return (
        <div className='fixed-top d-flex px-5 py-4'>
            <ul className='nav-list'>
                <h4 className='m-0 cursor text-white'>✝ CCA</h4>
                <li><Link to="/">Home</Link></li>
                <li><a href="/">About</a></li>
                <li><a href="/">Schedule Events</a></li>
                <li><a href="/">Gallary</a></li>
                <li><a href="/">Contact</a></li>
            </ul>
            <span class="material-symbols-outlined ms-auto cursor landingPageMenu d-none" onClick={handleMenu}>
                menu
            </span>
        </div>
    )
}

export default Header
