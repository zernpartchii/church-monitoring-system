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
}

module.exports = AttendanceModel;