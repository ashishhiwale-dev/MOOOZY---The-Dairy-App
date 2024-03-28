const JWT = require('jsonwebtoken')
const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel')

// Register
const  registerController = async(req,res) => {
    try {
        const {name,email,password} = req.body
        // validation
        if(!name){
            return res.status(400).send({
                success:false,
                message:'Name is require'
            })
        }
        if(!email){
            return res.status(400).send({
                success:false,
                message:'Email is require'
            })
        }
        if(!password || password.length < 6){
            return res.status(400).send({
                success:false,
                message:'Password is require and 6 character long'
            })  
        }

        // existing user
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(500).send({
                success:false,
                message:'User already registered with this email'
            })
        }
        // Hashed password
        const hashedPassword = await hashPassword(password)

        // Save user
        const user = await userModel({name,email,password:hashedPassword}).save();
        return res.status(201).send({
            success:true,
            message:'Registeration Sucessfull Please Login'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error in Register API',
            error,
        });
    }
};


//Login
const loginController = async(req,res) => {
    try {
        const {email,password} = req.body
        //validation
        if(!email || !password){
            return res.status(500).send({
                success:false,
                message:'Please Provide Email or Password'
            })
        }
        // find user 
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(500).send({
                success:false,
                message:'User not found'
            })
        }
        // Match Password
        const match = await comparePassword(password, user.password) 
        if(!match){
            return res.status(500).send({
                success:false,
                message:'Invalid Username or Password'
            })
        }

        // Token
        const token = await JWT.sign({_id: user._id},process.env.JWT_SECRET,{
            expiresIn:'7d',
         })

        // undefined Password 
        user.password = undefined;
        res.status(200).send({
            success:true,
            message:'login Sucessfully',
            token,
            user

        })


    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'error in login api',
            error
        });
    }
};


module.exports = {loginController, registerController};