export const getUserToken = () => {
    const token = localStorage.getItem('cmsUserToken');
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
}