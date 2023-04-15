const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');


//create user register user
exports.registerController = async(req,res)=>{
    try{
        const {username,email,password} = req.body
        //validation
        if(!username || !email || !password){
         return res.status(401).send({
            Success:false,
            message:'Please fill all fields'
         }) 
        }

        //existing user
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(500).send({
                sucess:false,
                message:'User Alredy Exists',
            })
        }
        //before save we have to convert the password into hash pattern.
        const hashPassword =  await bcrypt.hash(password,10)//10 is the salt value
        //password = hashPassword;

        //save new user
        const user = new userModel({username,email,password:hashPassword})
        await user.save()
        return res.status(200).send({
            sucess:true,
            message:'New User Created',
            user
        })
    }catch(err){
        console.log(err);
        return res.status(500).send({
            message:"Error in Registerd Callback",
            Success:false,
            err
        })
    }
}

//create login
exports.loginController =async(req,res)=>{
    try{
       const {email,password} = req.body
       //validation
       if(!email || !password){
         return res.status(401).send({
            sucess:false,
            message:'Please provide email or password'
         })
       }
       const user = await userModel.findOne({email});
       if(!user){
         return res.status(200).send({
            sucess:false,
            message:'Email is not registerd'
         })
       }
       //password
       const isMatch = await bcrypt.compare(password,user.password)
       if(!isMatch){
        return res.status(401).send({
            sucess:false,
            message:'Password is not matched',
        })
       }
      
       //Sucess
       return res.status(200).send({
        sucess:true,
        message:'Login Sucessfully',
        user
       })

    }catch(err){
       console.log(err);
       return res.status(500).send({
         sucess:false,
         message:'Error in Login Callback',
         err
       })
    }
}

//get all user
exports.getAlluser =async(req,res)=>{
    try{
        const users = await userModel.find({})
        return res.status(200).send({
            sucess:true,
            userCount:users.length,
            message:'All ussers data',
            users
        });
    }catch(err){
        console.log(err);
        return res.status(500).send({
            sucess:false,
            message:'Error in Get All Users',
            err
        })
    }
}