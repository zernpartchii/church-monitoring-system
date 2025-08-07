const db = require('../config/db');

class ScheduleEvent {
    static create(data, callback) {
        db.query('INSERT INTO schedule_event SET ?', data, (err, result) => {
            if (err) {
                console.error("Insert error:", err);
            } else {
                console.log("Insert result:", result);
            }
            callback(err, result);
        });
    }

    static read(churchID, callback) {
        db.query('SELECT * FROM schedule_event WHERE churchID = ?', [churchID], (err, result) => {
            if (err) {
                console.error("Read check error:", err);
            } else {
                console.log("Read check result:", result);
            }
            callback(err, result);
        });
    }

    static update(data, id, callback) {
        db.query('UPDATE schedule_event SET ? WHERE id = ?', [data, id], (err, result) => {
            if (err) {
                console.error("Update error:", err);
            } else {
                console.log("Update result:", result);
            }
            callback(err, result);
        });
    }

    static delete(id, callback) {
        db.query('DELETE FROM schedule_event WHERE id = ?', id, (err, result) => {
            if (err) {
                console.error("Delete error:", err);
            } else {
                console.log("Delete result:", result);
            }
            callback(err, result);
        });
    }
}

module.exports = ScheduleEvent;