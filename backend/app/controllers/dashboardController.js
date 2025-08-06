const attendanceModel = require('../models/attendanceModel');
exports.getAttendanceByChurch = (req, res) => {
    const { churchID } = req.body;
    console.log(churchID);
    attendanceModel.getAttendanceByChurch(churchID, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};