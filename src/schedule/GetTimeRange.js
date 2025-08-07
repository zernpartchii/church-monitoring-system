
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