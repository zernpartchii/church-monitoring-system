import React from 'react'
import BirthdayNotif from './BirthdayNotif'
const NotificationPage = () => {

    return (
        <div className='p-3'>
            <h3 className="text-start mb-4">Notifications</h3>
            <ul className="nav nav-underline" id="myTab" role="tablist">
                <li className="nav-item center gap-3" role="presentation">
                    <button className="nav-link  actionButtons tab active  position-relative" id="birthday-tab" data-bs-toggle="tab" data-bs-target="#birthday-tab-pane" type="button" role="tab" aria-controls="birthday-tab-pane" aria-selected="true">Birthday`s
                        <span className="position-absolute top-0 start-100 translate-middle badge bg-danger bdayBadge">0</span>
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link actionButtons tab" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Other</button>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="birthday-tab-pane" role="tabpanel" aria-labelledby="birthday-tab" tabIndex="0">
                    <BirthdayNotif />
                </div>
                <div className="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0">
                    Nothing to show here yet.
                </div>
            </div>
        </div>
    )
}

export default NotificationPage
