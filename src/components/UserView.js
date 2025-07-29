export const UserView = () => {
    const adminUrl = window.location.href;
    const adminNav = document.querySelector('.adminNav');
    const userNav = document.querySelectorAll('.userNav, .userLogo, .userTopLogo');
    const topbarTitle = document.querySelector('.topbarTitle');

    if (adminUrl.includes('admin')) {
        userNav.forEach((nav) => {
            nav.classList.add('d-none');
        });
        topbarTitle.textContent = 'Admin';
        adminNav.classList.remove('d-none');
    } else {
        userNav.forEach((nav) => {
            nav.classList.remove('d-none');
        });
        adminNav.classList.add('d-none');
        topbarTitle.textContent = 'User';
    }
}