const { text } = require('express');
const db = require('../config/db');
const bcrypt = require('bcrypt');

require('dotenv').config(); // At the top of your main file
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

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
            `SELECT u.id, c.churchID, c.churchName, c.churchAddress, u.userID, u.role, u.username, u.password, cg.email, cg.firstName, cg.lastName
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

                const userToken = {
                    churchID: user.churchID,
                    churchName: user.churchName,
                    churchAddress: user.churchAddress,
                    userID: user.userID,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName
                }

                // ✅ Create JWT token
                const token = jwt.sign(userToken, secretKey, { expiresIn: '1h' });

                // If login successful
                return callback(null, {
                    icon: 'success',
                    success: true,
                    message: "Login successful",
                    text: "You are now logged in",
                    token: token,
                });
            }
        );

    }
}

module.exports = AccountModel;