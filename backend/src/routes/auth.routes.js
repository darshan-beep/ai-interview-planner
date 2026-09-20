const express = require("express")
const authrouter = express.Router()
const authmiddleware = require("../middleware/auth.middleware")
const authcontroller = require("../controller/auth.controller")
authrouter.post("/register",authcontroller.registerusercontroller)
authrouter.post("/login",authcontroller.loginusercontroller)
authrouter.get("/logout",authcontroller.logoutusercontroller)
authrouter.get("/get-me",authmiddleware.authusermiddleware,authcontroller.getMecontroller)
module.exports = authrouter