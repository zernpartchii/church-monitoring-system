const churchgoerModel = require('../models/churchGoerModel');

exports.checkChurchGoer = (req, res) => {
    const { firstName, middleName, lastName } = req.body;
    churchgoerModel.checkDuplicate([firstName, middleName, lastName], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
}

exports.getAllChurchGoers = (req, res) => {
    churchgoerModel.read((err, results) => {
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

