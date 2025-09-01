import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Swal from 'sweetalert2';
import Axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'; // required for dateClick  
import { toPHDateTimeLocal } from '../util/DateFomatter';
import { getTimeRangeFromEvents, AddSchedButton, showModal } from './Util';
import { getUserToken } from '../accounts/GetUserToken';

const Schedule = () => {

    const url = 'http://localhost:5000/api';
    const churchID = getUserToken().churchID;
    const userID = getUserToken().userID;

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

        // Add Schedule Button
        AddSchedButton();

        // Fixed Full Calendar
        document.querySelector('.fc-dayGridMonth-button').click();
        const btnAddSchedule = document.querySelector('.btnAddSchedule');
        btnAddSchedule.addEventListener('click', handleReset);

        // Read Schedule
        ReadScheduleEvent();
    }, []);

    // Read Schedule
    const ReadScheduleEvent = () => {
        Axios.get(`${url}/getScheduleEvent/${churchID}`)
            .then((res) => {
                // Convert it to FullCalendar format
                const event = res.data.result.map(item => ({
                    title: item.eventName,
                    start: item.eventStart,
                    end: item.eventEnd,
                    extendedProps: {
                        id: item.id,
                        location: item.eventLocation,
                        host: item.eventHost,
                        description: item.eventDescription
                    }
                }));

                // Set Event
                setEvents(event);

            }).catch((error) => {
                console.log(error);
            });
    }

    // Add New Schedule
    const handleDateClick = (info) => {
        setSchedule({
            ...data,
            eventStart: new Date(info.dateStr).toISOString().slice(0, 16), // ⬅️ ISO string for datetime-local
            eventEnd: new Date(info.dateStr).toISOString().slice(0, 16),
        });
        showModal();
        document.querySelector('.btnDeleteSched').classList.add('d-none');
    };

    // Set Value per field 
    const handleEventClick = (info) => {
        const { title, start, end, extendedProps } = info.event;
        setSchedule({
            eventID: extendedProps.id,
            eventName: title,
            eventLocation: extendedProps.location,
            eventHost: extendedProps.host,
            eventStart: toPHDateTimeLocal(start),
            eventEnd: toPHDateTimeLocal(end),
            eventDescription: extendedProps.description,
        })
        document.querySelector('.btnDeleteSched').classList.remove('d-none');
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
        ReadScheduleEvent();
        document.querySelector('.btnDeleteSched').classList.add('d-none');
    }

    // Create and Update Data
    const handleSubmit = (e) => {
        e.preventDefault();
        schedule.churchID = churchID;
        schedule.userID = userID;
        if (schedule.eventID) {
            // Update Schedule Event
            Axios.put(`${url}/updateScheduleEvent`, schedule).then((res) => {
                Swal.fire({
                    icon: "success",
                    title: res.data.message,
                    text: "Schedule Event has been updated successfully."
                })
                handleReset();
                document.querySelector('.btnCloseSched').click();
            }).catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "Something went wrong."
                })
            });
        } else {
            // Create Schedule Event
            Axios.post(`${url}/createScheduleEvent`, schedule).then((res) => {
                Swal.fire({
                    icon: "success",
                    title: res.data.message,
                    text: "Schedule Event has been added successfully."
                })
                handleReset();
                document.querySelector('.btnCloseSched').click();
            }).catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "Something went wrong."
                })
            });
        }
    }

    // Delete Schedule Event
    const handleDelete = () => {
        Axios.delete(`${url}/deleteScheduleEvent/${schedule.eventID}`).then((res) => {
            Swal.fire({
                icon: "success",
                title: res.data.message,
                text: "Schedule Event has been deleted successfully."
            })
            handleReset();
            document.querySelector('.btnCloseSched').click();
        }).catch((error) => {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Something went wrong."
            })
        });
    }

    return (
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
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <form onSubmit={handleSubmit} className="modal-content">
                        <div className="modal-header d-flex flex-between">
                            <h1 className="modal-title fs-5" id="dayModalLabel">Schedule Event</h1>
                            <button type="button" className="btn btn-danger px-3" data-bs-dismiss="modal">X</button>
                        </div>
                        <div className="modal-body d-flex flex-wrap gap-3">
                            <div className='d-flex flex-wrap gap-3'>
                                <div className='flex-fill'>
                                    <label>Schedule Event Name</label>
                                    <input type='text' required value={schedule.eventName || ''}
                                        onChange={handleOnChange} className='form-control' id='eventName' />
                                </div>
                                <div className='flex-fill'>
                                    <label>Host</label>
                                    <input type='text' required value={schedule.eventHost || ''}
                                        onChange={handleOnChange} className='form-control' id='eventHost' />
                                </div>
                                <div className='flex-fill w-100'>
                                    <label>Location</label>
                                    <input type='text' required value={schedule.eventLocation || ''}
                                        onChange={handleOnChange} className='form-control' id='eventLocation' />
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
                            </div>
                            <div className='flex-fill'>
                                <label>Descripton (Optional)</label>
                                <textarea type='text' value={schedule.eventDescription || ''} rows={4}
                                    onChange={handleOnChange} className='form-control' id='eventDescription' />
                            </div>
                        </div>
                        <div className="modal-footer d-flex">
                            <button type="button" className="btn btn-danger btnDeleteSched d-none" onClick={handleDelete}>Delete</button>
                            <div className='d-flex gap-2 ms-auto'>
                                {/* <button type="button" className="btn btn-outline-secondary text-white" onClick={handleReset}>Reset</button> */}
                                <button type="button" className="btn btn-secondary px-3 btnCloseSched" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-success">Save Schedule</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default Schedule;
