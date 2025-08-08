export const formatDateTime = (date) => {
    const pad = (n) => String(n).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are 0-indexed
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    // Sample Output: "2023-08-01 12:34:56"
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const formatDateForInput = (isoDateString) => {
    if (!isoDateString) return "";

    const localDate = new Date(isoDateString);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');

    // Sample Output: "2023-08-01"
    return `${year}-${month}-${day}`; // Matches <input type="date"> format
};

export const formatDateShort = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-CA', {
        month: 'long', // "Jan", "Feb", ...
        day: '2-digit'  // "01", "02", ..., "31"
    });
}

export const formatTo12Hour = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(+hour);
    date.setMinutes(+minute);

    // Convert "17:00" to "5:00 PM"
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
}

export const toPHDateTimeLocal = (dateString) => {
    const date = new Date(dateString);
    // Adjust to Philippine Time (UTC+8)
    date.setHours(date.getHours() + 8);
    return date.toISOString().slice(0, 16);
};



