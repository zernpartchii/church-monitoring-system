import React, { useEffect } from 'react';


const BirthdayNotif = () => {

    const data = localStorage.getItem('churchgoers');
    const churchgoers = data ? JSON.parse(data) : [];

    const formatDate = (date) =>
        new Date(date).toLocaleDateString('en-CA', { month: 'long', day: 'numeric' });

    const daysUntil = (date) => {
        const today = new Date();
        const birthday = new Date(date);
        birthday.setFullYear(today.getFullYear());

        if (birthday < today.setHours(0, 0, 0, 0)) {
            birthday.setFullYear(today.getFullYear() + 1);
        }

        const diffTime = birthday - new Date();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const ageTurning = (date) => {
        const today = new Date();
        const birthDate = new Date(date);
        let age = today.getFullYear() - birthDate.getFullYear();
        const hasBirthdayPassed =
            new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) <= today;
        if (!hasBirthdayPassed) age -= 1;
        return age; // Turning age
    };

    const upcomingBirthdays = churchgoers.filter(p => daysUntil(p.date) <= 31);
    const pastBirthdaysThisMonth = churchgoers.filter(p => {
        const today = new Date();
        const birthday = new Date(p.date);
        return (
            birthday.getMonth() === today.getMonth() &&
            daysUntil(p.date) > 31
        );
    });

    const sortedUpcoming = [...upcomingBirthdays].sort((a, b) => daysUntil(a.date) - daysUntil(b.date));

    useEffect(() => {
        document.querySelector('.bdayBadge').textContent = sortedUpcoming.length;
        document.querySelector('.notifBadge').textContent = sortedUpcoming.length;
    }, [])

    return (
        <div className="p-3">
            <h5 className="mb-4">🎂 This Month's Birthdays</h5>

            {/* UPCOMING */}
            {sortedUpcoming.length > 0 && (
                <>
                    <h6 className="text-secondary mb-3">Coming Up Soon</h6>
                    <div className="d-flex flex-wrap gap-3">
                        {sortedUpcoming.map((person, index) => {
                            const daysLeft = daysUntil(person.date);
                            const isToday = daysLeft === 0;
                            const turningAge = ageTurning(person.date);

                            return (
                                <div className="flex-fill" key={index}>
                                    <div
                                        className="card shadow-sm border-0 rounded-3 h-100 d-flex flex-column"
                                        style={{
                                            backgroundColor: isToday ? '#fff3cd' : '#ffffff',
                                            borderLeft: isToday ? '5px solid #ffc107' : 'none',
                                            minHeight: '270px'
                                        }}
                                    >
                                        <div className="card-body text-center d-flex flex-column justify-content-between">
                                            <div>
                                                <div style={{
                                                    fontSize: '40px',
                                                    backgroundColor: isToday ? '#ffeeba' : '#ffe9b3',
                                                    width: '70px',
                                                    height: '70px',
                                                    lineHeight: '70px',
                                                    borderRadius: '50%',
                                                    margin: '0 auto 10px',
                                                    color: '#ff8c00'
                                                }}>
                                                    🎂
                                                </div>
                                                <p className="m-0 text-muted">{formatDate(person.date)}</p>
                                                <p className="text-success fw-bold m-0">
                                                    {isToday
                                                        ? `Happy ${turningAge} Birthday!`
                                                        : `Turning ${turningAge} this month`}
                                                </p>
                                                <h5 className="card-title text-dark text-capitalize">{person.name}</h5>
                                                <p className="text-muted mb-2">{person.role}</p>
                                            </div>
                                            {isToday ? (
                                                <span className="badge bg-warning text-dark">
                                                    🎂 Has a birthday today!
                                                </span>
                                            ) : (
                                                <span className="badge bg-primary-subtle text-primary border border-primary">
                                                    🎂 Coming in {daysLeft} day{daysLeft > 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* PAST */}
            {pastBirthdaysThisMonth.length > 0 && (
                <>
                    <h6 className="text-secondary mt-4 mb-3">Already Celebrated</h6>
                    <div className="d-flex flex-wrap gap-3">
                        {pastBirthdaysThisMonth
                            .slice() // make a copy so we don’t mutate original
                            .sort((a, b) => {
                                const dayA = new Date(a.date).getDate();
                                const dayB = new Date(b.date).getDate();
                                return dayB - dayA; // newest first
                            })
                            .map((person, index) => {
                                const turningAge = ageTurning(person.date);
                                return (
                                    <div
                                        className="flex-fill" key={index} >
                                        <div className="card shadow-sm border-0 rounded-3 h-100"
                                            style={{
                                                backgroundColor: '#FFFFFF',
                                                minHeight: '270px'
                                            }}>
                                            <div className="card-body text-center d-flex flex-column justify-content-between">
                                                <div>
                                                    <div
                                                        style={{
                                                            fontSize: '40px',
                                                            backgroundColor: '#f0f0f0',
                                                            width: '70px',
                                                            height: '70px',
                                                            lineHeight: '70px',
                                                            borderRadius: '50%',
                                                            margin: '0 auto 10px',
                                                            color: '#888'
                                                        }}
                                                    >
                                                        ✅
                                                    </div>
                                                    <p className="m-0 text-muted">{formatDate(person.date)}</p>
                                                    <p className="text-success fw-bold m-0">
                                                        Turned {turningAge} this month
                                                    </p>
                                                    <h5 className="card-title text-dark text-capitalize">{person.name}</h5>
                                                    <p className=" mb-2 text-muted">{person.role}</p>
                                                </div>
                                                <span className="badge bg-success-subtle text-success border border-success">
                                                    🎉 Already celebrated
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </>
            )}

        </div>
    );
};

export default BirthdayNotif;
