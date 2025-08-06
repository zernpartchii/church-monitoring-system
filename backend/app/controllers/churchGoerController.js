const churchgoerModel = require('../models/churchGoerModel');

exports.checkChurchGoer = (req, res) => {
    const { firstName, lastName } = req.body;
    churchgoerModel.checkDuplicate([firstName, lastName], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
}

exports.getAllChurchGoers = (req, res) => {
    const churchID = req.body.churchID;
    churchgoerModel.read(churchID, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

exports.insertChurchGoer = (req, res) => {
    const churchgoerData = req.body;
    churchgoerModel.create(churchgoerData, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Added Successfully!', id: results.insertId });
    });
};

exports.updateChurchGoer = (req, res) => {

    const userID = req.body.id;
    const churchgoerData = req.body;

    // Remove the `id` field
    delete churchgoerData.id;

    // console.log(userID, churchgoerData);

    churchgoerModel.update(churchgoerData, userID, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Updated Successfully!' });
    });
};

exports.deleteChurchGoer = (req, res) => {
    const userID = req.body.id;
    // console.log(userID);
    churchgoerModel.delete(userID, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Deleted Successfully!' });
    });
};

