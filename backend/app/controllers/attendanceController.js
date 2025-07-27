const attendanceModel = require('../models/attendanceModel');

exports.insertAttendance = (req, res) => {
    const attendanceData = req.body;
    attendanceModel.create(attendanceData, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Added Successfully!', id: results.insertId });
    });
};

exports.getAllAttendances = (req, res) => {
    attendanceModel.read((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};