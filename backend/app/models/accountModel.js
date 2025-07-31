const { text } = require('express');
const db = require('../config/db');
const bcrypt = require('bcrypt');
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
    static checkUsername(username, password, callback) {
        console.log(username)
        db.query(
            `SELECT u.id, c.churchID, c.churchName, u.userID, u.role, u.username, u.password, cg.email, cg.firstName, cg.lastName 
            FROM users u 
            INNER JOIN churchgoer cg ON u.userID = cg.id 
            INNER JOIN church c ON c.churchID = u.churchID 
            WHERE u.username = ? OR cg.email = ?`,
            [username, username],
            async (err, result) => {
                if (err) {
                    console.error("Query error:", err);
                    return callback(err, null);
                }

                if (result.length === 0) {
                    return callback(null, {
                        icon: 'error',
                        success: false,
                        message: "Wrong username or email!",
                        text: "Please check your credentials and try again."
                    });
                }

                const user = result[0];
                console.log(user);

                // ✅ Now compare hashed password in Node using bcrypt
                const match = await bcrypt.compare(password, user.password);

                if (!match) {
                    return callback(null, {
                        icon: 'error',
                        success: false,
                        message: "Wrong password!",
                        text: "Please check your password and try again."
                    });
                }

                // If login successful
                return callback(null, {
                    icon: 'success',
                    success: true,
                    message: "Login successful",
                    text: "You are now logged in",
                    user: user
                });
            }
        );

    }
}

module.exports = AccountModel;