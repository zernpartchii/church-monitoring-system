const db = require('../config/db');

class Church {

    static checkDuplicate(churchName, callback) {
        db.query('SELECT * FROM church WHERE churchName = ?', [churchName], callback);
    }

    static create(data, callback) {
        db.query('INSERT INTO church SET ?', data, callback);
    }

    static read(callback) {
        db.query('SELECT * FROM church', callback);
    }
}
module.exports = Church;