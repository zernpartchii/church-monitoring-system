export const getUserToken = () => {
    const token = localStorage.getItem('cmsUserToken');
    if (!token) return window.location.href = '*';
    const payload = JSON.parse(atob(token.split('.')[1]));
    // console.table(payload);
    return payload;
}; 