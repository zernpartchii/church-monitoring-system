const scheduleEvent = require('../models/scheduleEvent');

// Create
exports.createScheduleEvent = (req, res) => {
    try {
        const data = req.body;
        scheduleEvent.create(data, (err, result) => {
            if (err) return res.status(500).json({ error: err.message, success: false });
            res.status(201).json({ message: 'Added Successfully!', id: result.insertId, success: true });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

// Read
exports.getScheduleEvent = (req, res) => {
    try {
        const churchID = req.params.churchID;
        scheduleEvent.read(churchID, (err, result) => {
            if (err) return res.status(500).json({ error: err.message, success: false });
            res.status(200).json({ result: result, success: true });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Update
exports.updateScheduleEvent = (req, res) => {
    try {
        const id = req.body.eventID;
        const data = req.body;
        delete data.eventID; // Delete the eventID field
        data.dateModified = new Date();

        scheduleEvent.update(data, id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Updated Successfully!' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

// Delete
exports.deleteScheduleEvent = (req, res) => {
    try {
        const id = req.params.id;
        scheduleEvent.delete(id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Deleted Successfully!' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}