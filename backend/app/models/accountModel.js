const db = require('../config/db');

class AccountModel {

    static create(data, callback) {
        db.query('INSERT INTO users SET ?', data, (err, result) => {
            if (err) {
                console.error("Insert error:", err);
            } else {
                console.log("Insert result:", result);
            }
            callback(err, result);
        });
    }
    static read(callback) {
        db.query('SELECT * FROM users', callback);
    }
}

module.exports = AccountModel;