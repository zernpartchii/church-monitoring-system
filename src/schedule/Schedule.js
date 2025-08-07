import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'; // required for dateClick  
import { Modal } from 'bootstrap';
import { formatTo12Hour } from '../util/DateFomatter';
import { getTimeRangeFromEvents } from '../schedule/GetTimeRange';
import { CreateScheduleEvent, ReadScheduleEvent } from '../schedule/HandleData';
import Swal from 'sweetalert2';

const Schedule = () => {

    const token = localStorage.getItem('cmsUserToken');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const churchID = payload.churchID;

    const data = {
        eventName: '',
        eventLocation: '',
        eventHost: '',
        eventStart: '',
        eventEnd: '',
        eventDescription: '',
    }

    const [event, setEvents] = useState([]);
    const [schedule, setSchedule] = useState(event);
    const { slotMinTime, slotMaxTime } = getTimeRangeFromEvents(event);

    useEffect(() => {
        // Fixed Full Calendar
        document.querySelector('.fc-dayGridMonth-button').click();

        // Add Schedule Button
        addButton();

        // Read Schedule
        ReadEvent();
    }, []);

    // Read Schedule
    const ReadEvent = async () => {
        const data = await ReadScheduleEvent(churchID);
        if (data.success === true) {
            // Convert it to FullCalendar format
            const event = data.result.map(item => ({
                title: item.eventName,
                start: item.eventStart,
                end: item.eventEnd,
                extendedProps: {
                    location: item.eventLocation,
                    host: item.eventHost,
                    description: item.eventDescription
                }
            }));
            // console.log(event);
            setEvents(event);
        } else {
            console.log(data.error);
        }
    }

    // Add Schedule Button
    const addButton = () => {
        const buttonGroup = document.querySelectorAll('.fc-button-group');
        const secondGroup = buttonGroup[0]; // 0 = first, 1 = second

        const AddScheduleButton = `<button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#dayModal">
                            Add Schedule
                        </button>`

        secondGroup.insertAdjacentHTML('beforebegin', AddScheduleButton);
    }

    // Add Data
    const handleDateClick = (info) => {
        setSchedule({
            ...data,
            eventStart: new Date(info.dateStr).toISOString().slice(0, 16), // ⬅️ ISO string for datetime-local
            eventEnd: new Date(info.dateStr).toISOString().slice(0, 16),
        });
        showModal();
    };

    // Edit Data
    const handleEventClick = (info) => {
        const { title, start, end, extendedProps } = info.event;
        setSchedule({
            eventName: title,
            eventLocation: extendedProps.location,
            eventHost: extendedProps.host,
            eventStart: new Date(start).toISOString().slice(0, 16), // ⬅️ ISO string for datetime-local
            eventEnd: new Date(end).toISOString().slice(0, 16),
            eventDescription: extendedProps.description,
        })
        showModal();
    };

    // Set Value per field
    const handleOnChange = (e) => {
        setSchedule({ ...schedule, [e.target.id]: e.target.value });
        // console.log(schedule)
    }

    // Clear forms
    const handleReset = () => {
        setSchedule(data);
    }

    // Show Modal
    const showModal = () => {
        const modal = new Modal(document.getElementById('dayModal'));
        modal.show();
    }

    // Submit Data
    const handleSubmit = async (e) => {
        e.preventDefault();
        schedule.churchID = churchID;
        const result = await CreateScheduleEvent(schedule);
        if (result) {
            Swal.fire({
                icon: "success",
                title: "Successfully Added!",
                text: "Schedule Event has been added successfully."
            })
            ReadEvent();
            handleReset();
        } else {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Something went wrong."
            })
        }
    }

    return (
        <div className='d-flex vh-100'>
            <Sidebar />
            <div className="w-100 overflow-auto">
                <Header />
                <div className='p-3'>

                    <div className='d-flex gap-2 mb-2'>
                        <h3 className="text-start m-0">Schedule Event</h3>
                    </div>

                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        height="auto"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,listWeek'
                        }}
                        events={event}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}  // 👈 Add this line
                        dayHeaderFormat={{ weekday: 'long' }}         // e.g., "Mon"
                        slotLabelFormat={{ hour: 'numeric', minute: '2-digit', hour12: true }} // e.g., "9:00 AM"
                        slotMinTime={slotMinTime}
                        slotMaxTime={slotMaxTime}
                    />

                    <div className="modal fade" id="dayModal" data-bs-backdrop="static"
                        data-bs-keyboard="false" tabIndex="-1" aria-labelledby="dayModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <form onSubmit={handleSubmit} className="modal-content">
                                <div className="modal-header d-flex flex-between">
                                    <h1 className="modal-title fs-5" id="dayModalLabel">Schedule Event</h1>
                                    <button type="button" className="btn btn-outline-danger px-3" data-bs-dismiss="modal">X</button>
                                </div>
                                <div className="modal-body d-flex flex-column gap-3">
                                    <div className='flex-fill'>
                                        <label>Schedule Event Name</label>
                                        <input type='text' required value={schedule.eventName || ''}
                                            onChange={handleOnChange} className='form-control' id='eventName' />
                                    </div>
                                    <div className='flex-fill'>
                                        <label>Location</label>
                                        <input type='text' required value={schedule.eventLocation || ''}
                                            onChange={handleOnChange} className='form-control' id='eventLocation' />
                                    </div>
                                    <div className='flex-fill'>
                                        <label>Host</label>
                                        <input type='text' required value={schedule.eventHost || ''}
                                            onChange={handleOnChange} className='form-control' id='eventHost' />
                                    </div>
                                    <div className='flex-fill'>
                                        <label>Date Time Start</label>
                                        <input type='datetime-local' required value={schedule.eventStart || ''}
                                            onChange={handleOnChange} className='form-control' id='eventStart' />
                                    </div>
                                    <div className='flex-fill'>
                                        <label>Date Time End</label>
                                        <input type='datetime-local' required value={schedule.eventEnd || ''}
                                            onChange={handleOnChange} className='form-control' id='eventEnd' />
                                    </div>
                                    <div className='flex-fill'>
                                        <label>Descripton (Optional)</label>
                                        <textarea type='text' value={schedule.eventDescription || ''}
                                            onChange={handleOnChange} className='form-control' id='eventDescription' />
                                    </div>
                                </div>
                                <div className="modal-footer d-flex">
                                    <button type="button" className="btn btn-danger me-auto" onClick={handleReset}>Delete</button>
                                    <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>Reset</button>
                                    <button type="button" className="btn btn-secondary px-3" data-bs-dismiss="modal">Cancel</button>
                                    <button type="submit" className="btn btn-success">Save Schedule</button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Schedule;
