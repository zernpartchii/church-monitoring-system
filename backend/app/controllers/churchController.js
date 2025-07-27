const churchModel = require('../models/churchModel');

exports.checkChurchName = (req, res) => {
    const { churchName } = req.body;
    console.log(churchName);
    churchModel.checkDuplicate(churchName, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}

exports.insertChurch = (req, res) => {
    const churchData = req.body;
    console.log(churchData);
    churchModel.create(churchData, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Added Successfully!', id: results.insertId });
    });
}

exports.getAllChurches = (req, res) => {
    churchModel.read((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};