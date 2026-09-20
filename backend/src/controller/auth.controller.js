const usermodel = require("../models/user.model")
const blacklistmodel = require("../models/blacklist.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
async function registerusercontroller(req,res){

    const {username,email,password} = req.body
if (!username||!password||!email){
   return res.status(400).json({
        message:"please provide username ,email ,password"
    }) 
     }
    const isuseralreadyexist = await usermodel.findOne({
        $or:[{email},{password}]
    })  
    if (isuseralreadyexist){
        return res.status(400).json({
            message:"user alreaxdy exist with username or password"
        })

    }
    const hash =  await bcrypt.hash(password,10)
    const user = await usermodel.create({
        username,
        email,
        password:hash
    })
    const token = jwt.sign(
        {id:user._id, username:user.username},
        process.env.JWT_SECRET,
        {expiresIn :"1d"}
)
res.cookie("token", token,)
    return res.status(201).json({
    message:"user registered successfully",
    user:{
        id:user._id,
        username:user.username,
        email:user.email
    }
})
}

async function loginusercontroller(req,res){
    const {email,password} = req.body
    const user = await usermodel.findOne({email})
    if (!user){
        return res.status(400).json({message:"Invalid credentials"})
    }
    const ismatch = await bcrypt.compare(password, user.password)
    if (!ismatch){
        return res.status(400).json({message:"Invalid credentials"})
    }
    const token = jwt.sign(
        {id:user._id, username:user.username},
        process.env.JWT_SECRET,
        {expiresIn :"1d"}
    )
    res.cookie("token", token,)
    res.status(200).json({
        message:"user logged in successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}
async function logoutusercontroller(req,res){
    const token = req.cookies.token
    if (token){
        await blacklistmodel.create({token})
    }
        res.clearCookie("token")
        return res.status(200).json({message:"user logged out successfully"})
    
}
async function getMecontroller(req,res){
    const user = await usermodel.findById(req.user.id)
    res.status(200).json({
        message:"user fetched successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}
module.exports={registerusercontroller, loginusercontroller, logoutusercontroller, getMecontroller}