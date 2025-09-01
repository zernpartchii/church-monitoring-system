const db = require('../config/db');

class Churchgoer {
    static checkDuplicate(data, callback) {
        console.log(data);
        db.query('SELECT * FROM churchgoer WHERE firstName = ? && lastName = ?', data, (err, result) => {
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

    static read(churchID, callback) {
        db.query('SELECT cg.id, cg.firstName, cg.middleName, cg.lastName, cg.email, cg.gender, cg.dateOfBirth, cg.ministry, cg.address, cg.contactNo, cg.dateCreated FROM users u INNER JOIN church c ON c.churchID = u.churchID INNER JOIN churchgoer cg ON u.userID = cg.id WHERE c.churchID = ?', [churchID], callback);
    }

    static update(data, id, callback) {
        db.query('UPDATE churchgoer SET ? WHERE id = ?', [data, id], (err, result) => {
            if (err) {
                console.error("Update error:", err);
            } else {
                console.log("Update result:", result);
            }
            callback(err, result);
        });
    }

    static delete(id, callback) {
        db.query('DELETE FROM churchgoer WHERE id = ?', id, (err, result) => {
            if (err) {
                console.error("Delete error:", err);
            } else {
                console.log("Delete result:", result);
            }
            callback(err, result);
        });
    }
}
module.exports = Churchgoer;