import Swal from 'sweetalert2';

export const formatByName = () => {
    const fullName = document.querySelectorAll('.fullName');
    const formalName = document.querySelectorAll('.formalName');
    const btnFormatName = document.querySelector('.btnFormatName');

    let formattedTo = '';

    fullName.forEach((name, index) => {
        const isFullNameVisible = !name.classList.contains('d-none');

        if (isFullNameVisible) {
            fullName[index].classList.add('d-none');
            formalName[index].classList.remove('d-none');
            formattedTo = 'Lastname Firstname';
            btnFormatName.textContent = 'swap_horiz';
        } else {
            fullName[index].classList.remove('d-none');
            formalName[index].classList.add('d-none');
            formattedTo = 'Firstname Lastname';
            btnFormatName.textContent = 'compare_arrows';
        }
    });

    // Show only one SweetAlert after formatting
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Format Updated",
        text: `Names have been formatted to (${formattedTo}) format.`,
        showConfirmButton: true,
    });
};

const getSortDirectionLabel = (order) => (order === 'asc' ? 'Ascending' : 'Descending');

const formatLabel = (key) => {
    // Optional: Prettify field names
    return key
        .replace(/([A-Z])/g, ' $1')    // camelCase to spaced
        .replace(/^./, (s) => s.toUpperCase()); // capitalize
};

export const sortAttendanceBy = (field, sortOrder, attendance, setSortOrder, setAttendance) => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';

    const sorted = [...attendance].sort((a, b) => {
        let aValue = a[field];
        let bValue = b[field];

        // Normalize strings
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();

        // Convert to date if field is "dateCreated"
        if (field.toLowerCase().includes("date")) {
            aValue = new Date(a[field]);
            bValue = new Date(b[field]);
        }

        if (aValue < bValue) return newOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return newOrder === 'asc' ? 1 : -1;
        return 0;
    });

    setSortOrder(newOrder);
    setAttendance(sorted);

    Swal.fire({
        position: "center",
        icon: "success",
        title: "Sorted Successfully",
        text: `Attendance sorted by ${formatLabel(field)} (${getSortDirectionLabel(newOrder)})`,
    });
};
