const express = require('express');
const router = express.Router();
const churchController = require('../controllers/churchController');
const churchGoerController = require('../controllers/churchGoerController');
const attendanceController = require('../controllers/attendanceController');
const accountController = require('../controllers/accountController');

// Attendance
router.get('/attendances', attendanceController.getAllAttendances);
router.post('/insertAttendance', attendanceController.insertAttendance);

// Church
router.get('/churches', churchController.getAllChurches);
router.post('/checkChurchName', churchController.checkChurchName);
router.post('/insertChurch', churchController.insertChurch);

// Church Goer
router.get('/churchgoers', churchGoerController.getAllChurchGoers);
router.post('/checkChurchGoer', churchGoerController.checkChurchGoer);
router.post('/insertChurchGoer', churchGoerController.insertChurchGoer);
router.put('/updateChurchGoer', churchGoerController.updateChurchGoer);
router.delete('/deleteChurchGoer', churchGoerController.deleteChurchGoer);

// Create Account
router.post('/createAccount', accountController.createAccount);

module.exports = router;
