const express = require('express');
const router = express.Router();
const churchController = require('../controllers/churchController');
const churchGoerController = require('../controllers/churchGoerController');
const attendanceController = require('../controllers/attendanceController');
const scheduleEvent = require('../controllers/scheduleEvent');
const accountController = require('../controllers/accountController');
const dashboard = require('../controllers/dashboardController');
// Dashboard
router.post('/getAttendanceByChurch', dashboard.getAttendanceByChurch);

// Attendance
router.get('/attendances', attendanceController.getAllAttendances);
router.post('/insertAttendance', attendanceController.insertAttendance);

// Schedule Events
router.post('/getScheduleEvent', scheduleEvent.getScheduleEvent);
router.post('/createScheduleEvent', scheduleEvent.createScheduleEvent);
router.put('/updateScheduleEvent', scheduleEvent.updateScheduleEvent);
router.delete('/deleteScheduleEvent', scheduleEvent.deleteScheduleEvent);

// Church
router.get('/churches', churchController.getAllChurches);
router.post('/checkChurchName', churchController.checkChurchName);
router.post('/insertChurch', churchController.insertChurch);

// Church Goer
router.post('/churchgoers', churchGoerController.getAllChurchGoers);
router.post('/checkChurchGoer', churchGoerController.checkChurchGoer);
router.post('/insertChurchGoer', churchGoerController.insertChurchGoer);
router.put('/updateChurchGoer', churchGoerController.updateChurchGoer);
router.delete('/deleteChurchGoer', churchGoerController.deleteChurchGoer);

// Create Account
router.post('/createAccount', accountController.createAccount);

// Login
router.post('/login', accountController.login);

module.exports = router;
