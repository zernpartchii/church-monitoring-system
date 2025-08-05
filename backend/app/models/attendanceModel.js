const db = require('../config/db');

class AttendanceModel {
    static create(data, callback) {
        const values = data.map(({ userID, service, date, status }) => [userID, service, date, status]);
        const query = `
            INSERT INTO attendance (userID, service, date, status)
            VALUES ?
            ON DUPLICATE KEY UPDATE status = VALUES(status)
        `;

        db.query(query, [values], callback); // let the controller handle the response
    }

    static read(callback) {
        db.query('SELECT * FROM attendance', callback);
    }

    static getAttendanceByChurch(churchID, callback) {
        db.query('SELECT a.service, a.date, a.status FROM `attendance` a INNER JOIN churchgoer cg ON a.userID = cg.id INNER JOIN users u ON cg.id = u.userID INNER JOIN church c ON c.churchID = u.churchID WHERE c.churchID = ?', [churchID], callback);
    }
}

module.exports = AttendanceModel;