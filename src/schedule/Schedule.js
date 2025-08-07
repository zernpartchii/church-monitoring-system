import React, { useState, useEffect } from 'react';
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

const Schedule = () => {

    const data = {
        eventName: '',
        eventLocation: '',
        eventHost: '',
        eventStart: '',
        eventEnd: '',
    }

    const event = [
        {
            title: 'Bible Study',
            start: '2025-08-07T17:00:00',
            end: '2025-08-07T18:00:00',
            extendedProps: {
                location: 'Purok 5',
                host: 'Braga Family',
            }
        },
        {
            title: 'Bible Sharing',
            start: '2025-08-03T11:00:00',
            end: '2025-08-05T15:00:00',
            extendedProps: {
                location: 'Purok 8',
                host: 'Pabuaya Family',
            }
        }
    ];

    const [scheldule, setSchedule] = useState(event);
    const { slotMinTime, slotMaxTime } = getTimeRangeFromEvents(event);

    useEffect(() => {
        // window.scrollTo(0, 0);
        document.querySelector('.fc-dayGridMonth-button').click();
        addButton();

    }, []);

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
            eventStart: new Date().toISOString().slice(0, 16), // ⬅️ ISO string for datetime-local
            eventEnd: new Date().toISOString().slice(0, 16),
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
        })
        showModal();
    };

    // Set Value per field
    const handleOnChange = (e) => {
        setSchedule({ ...scheldule, [e.target.id]: e.target.value });
        console.log(scheldule)
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
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(scheldule);
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
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="dayModalLabel">Schedule Event</h1>
                                </div>
                                <div className="modal-body d-flex flex-column gap-3">
                                    <div className='flex-fill'>
                                        <label>Schedule Event Name</label>
                                        <input type='text' required value={scheldule.eventName || ''}
                                            onChange={handleOnChange} className='form-control' id='eventName' />
                                    </div>
                                    <div className='flex-fill'>
                                        <label>Location</label>
                                        <input type='text' required value={scheldule.eventLocation || ''}
                                            onChange={handleOnChange} className='form-control' id='eventLocation' />
                                    </div>
                                    <div className='flex-fill'>
                                        <label>Host</label>
                                        <input type='text' required value={scheldule.eventHost || ''}
                                            onChange={handleOnChange} className='form-control' id='eventHost' />
                                    </div>
                                    <div className='flex-fill'>
                                        <label>Date Time Start</label>
                                        <input type='datetime-local' required value={scheldule.eventStart || ''}
                                            onChange={handleOnChange} className='form-control' id='eventStart' />
                                    </div>
                                    <div className='flex-fill'>
                                        <label>Date Time End</label>
                                        <input type='datetime-local' required value={scheldule.eventEnd || ''}
                                            onChange={handleOnChange} className='form-control' id='eventEnd' />
                                    </div>
                                </div>
                                <div className="modal-footer d-flex">
                                    <button type="button" className="btn btn-outline-danger me-auto" onClick={handleReset}>Delete</button>
                                    <button type="button" className="btn btn-danger" onClick={handleReset}>Reset</button>
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
