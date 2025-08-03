const bcrypt = require('bcrypt');
const accountModel = require('../models/accountModel');
const { text } = require('express');

const hashPassword = async (plainPassword) => {
    const saltRounds = 3; // Recommended value
    try {
        const hashed = await bcrypt.hash(plainPassword, saltRounds);
        return hashed;
    } catch (err) {
        console.error("Error hashing password:", err);
        return null;
    }
};

const checkPassword = async (plainPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (err) {
        console.error("Error checking password:", err);
        return false;
    }
};

exports.createAccount = async (req, res) => {
    const { churchID, userID, role, username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
        return res.status(500).json({ error: 'Failed to hash password' });
    }

    const data = {
        churchID,
        userID,
        role,
        username,
        password: hashedPassword
    }

    accountModel.create(data, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Added Successfully!', id: results.insertId });
    });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    accountModel.checkUsername(username, password, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Server error" });
        }

        if (!result.success) {
            return res.status(200).json({
                icon: result.icon,
                message: result.message,
                text: result.text,
            });
        }

        return res.status(200).json({
            icon: result.icon,
            message: result.message,
            text: result.text,
            token: result.token
        });
    });
};



