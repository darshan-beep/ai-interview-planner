const express = require ('express');
const interviewrouter = express.Router();
const authmiddleware = require("../middleware/auth.middleware")
const interviewcontroller = require("../controller/interviewcontroller")
const upload = require("../middleware/filemiddleware")

interviewrouter.post('/',authmiddleware.authusermiddleware,upload.single("resume"),interviewcontroller.generateinterviewreportcontroller)

interviewrouter.get('/report/:interviewId',authmiddleware.authusermiddleware,interviewcontroller.getinterviewreportByIdcontroller)

interviewrouter.get('/',authmiddleware.authusermiddleware,interviewcontroller.getAllinterviewreportscontroller)
interviewrouter.post('/resume/pdf/:interviewId',authmiddleware.authusermiddleware,interviewcontroller.generatepdfcontroller)

module.exports= interviewrouter
