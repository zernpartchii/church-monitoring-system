const db = require('../config/db');

class Churchgoer {
    static checkDuplicate(data, callback) {
        db.query('SELECT * FROM churchgoer WHERE firstName = ? && middleName = ? && lastName = ?', data, (err, result) => {
            if (err) {
                console.error("Duplicate check error:", err);
            } else {
                console.log("Duplicate check result:", result);
            }
            callback(err, result);
        });
    }

    static create(data, callback) {
        console.log("Inserting churchgoer:", data);
        db.query('INSERT INTO churchgoer SET ?', data, (err, result) => {
            if (err) {
                console.error("Insert error:", err);
            } else {
                console.log("Insert result:", result);
            }
            callback(err, result);
        });
    }

    static read(callback) {
        db.query('SELECT * FROM churchgoer', callback);
    }
}
module.exports = Churchgoer;