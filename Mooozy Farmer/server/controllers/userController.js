const JWT = require('jsonwebtoken')
const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel')
const { verifyToken } = require('../middlewares/authMiddleware');

// Register
const  registerController = async(req,res) => {
    try {
        const { name, email, password, phoneNumber, address, selectedLocation } = req.body
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
        const user = await userModel.create({ name, email, password: hashedPassword });
        // Return success response
        return res.status(201).json({ success: true, message: 'Registration successful', name: user.name });

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

// Fetch user's name

  
  // Fetch user's name by user ID
const getNameController = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, name: user.name });
    } catch (error) {
        console.error('Error fetching user name:', error);
        res.status(500).json({ success: false, message: 'Error fetching user name', error });
    }
};

////
// updatedetails
const detailsController = async (req, res) => {
    try {
        const { phoneNumber, address, selectedLocation } = req.body;
        const userId = req.userId; // Assuming you have authentication middleware to get user ID

        // Update user details in the database
        const user = await userModel.findByIdAndUpdate(userId, { phoneNumber, address, selectedLocation }, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, message: 'User details updated successfully', user });
    } catch (error) {
        console.error('Error saving user details:', error);
        return res.status(500).json({ success: false, message: 'Failed to save userrrr details', error: error.message });
    }
};

module.exports = {loginController, registerController, getNameController, detailsController};