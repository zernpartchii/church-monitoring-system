import { Modal } from 'bootstrap';
export const getTimeRangeFromEvents = (events) => {
    let minHour = 24;
    let maxHour = 0;

    events.forEach(event => {
        const startHour = new Date(event.start).getHours();
        const endHour = new Date(event.end).getHours();

        if (startHour < minHour) minHour = startHour;
        if (endHour > maxHour) maxHour = endHour;
    });

    return {
        slotMinTime: `${minHour}:00:00`,
        slotMaxTime: `${maxHour + 1}:00:00` // +1 to include that hour
    };
};

// Add Schedule Button
export const AddSchedButton = () => {
    const buttonGroup = document.querySelectorAll('.fc-button-group');
    const secondGroup = buttonGroup[0]; // 0 = first, 1 = second

    const AddScheduleButton = `<button type="button" class="btn btn-secondary btnAddSchedule" data-bs-toggle="modal" data-bs-target="#dayModal">
                            Add Schedule
                        </button>`

    secondGroup.insertAdjacentHTML('beforebegin', AddScheduleButton);
}

// Show Modal
export const showModal = () => {
    const modal = new Modal(document.getElementById('dayModal'));
    modal.show();
}