const express = require('express')
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const {  mongoose } = require('mongoose')
const bcrypt = require('bcryptjs');
const router = express.Router()
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');


router.get('/getUsers',async (req,res)=>{
    try {
        // const data = {'secret':'gopuaakash@2003',user:'gopu',logg:'30jan',potd:true,time:10,water:false};
        // const resp = await jwt.sign(data,'gopu123');
        // // res.json(resp)
        // const encoded = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZWNyZXQiOiJnb3B1YWFrYXNoQDIwMDMiLCJ1c2VyIjoiZ29wdSIsImxvZ2ciOiIzMGphbiIsInBvdGQiOnRydWUsInRpbWUiOjEwLCJ3YXRlciI6ZmFsc2UsImlhdCI6MTcwNjY4ODIxNX0.c9zWxUK-iy7sqvFyGrYCZyG3KJPh-UZ5OGt2uke0Ies"
        // const dec = await jwt.verify(encoded,'gopu123');
        // res.json(dec);
        const Users = await User.find({});
        res.json(Users)
    } catch (error) {
        res.status(400).json({success:false,message:'Internal Server Error',err:error})
    }
})

router.post('/createuser', body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 5 }), async (req, res) => {
    try {
        const isError = validationResult(req);
        // console.log(isError);
        if (!isError.isEmpty()) {
            return res.status(400).json({ message: isError.errors[0].path + ' "' + isError.errors[0].value + '" is Invalid', success: false })
        }

        const isExists = await User.findOne({ email: req.body.email })
        if (isExists) {
            return res.status(400).json({ message: 'Email Already exists' })
        }
        // console.log(req.body);
        const salt = await bcrypt.genSalt();
        const secPass = await bcrypt.hash(req.body.password,salt);
        const newUser = new User({...req.body,password:secPass});
        const authToken = jwt.sign({
            user:{
                id:newUser.id
            }
        },process.env.SECRET_KEY)
        await newUser.save()
        res.json({ message: 'User saved Successfully', success: true,user:newUser,authToken })
    } catch (error) {
        res.json({ message: 'Internal Server Error', err: error })
    }
})

router.post('/loginuser', async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(email);
        const logUser = await User.findOne({ email: email });
        // console.log(emailExists);
        if (!logUser) {
            return res.status(400).json({ message: 'Email does not exists. Please create a new account',success:false })
        }
        const passMatch = await bcrypt.compare(password,logUser.password);
        if (!passMatch) {
            return res.status(400).json({ message: 'Password incorrect', success: false });
        }
        const authToken = jwt.sign({
            user:{
                id:logUser.id
            }
        },process.env.SECRET_KEY)
        res.json({ message: 'Logged in successfully',authToken,success:true })
    } catch (error) {
        res.send(error)
    }
})

router.post('/getUser',fetchUser,async (req,res)=>{
    try {
        const userId = req.user.id;
        res.json({userId})
    } catch (error) {
        console.log(error);
    }
})

module.exports = router