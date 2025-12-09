const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {Client,Seller} = require('../database-models');



  // Hanlde the register
    const registerUser= async (req,res)=>{
        const {email,fullName,password,role}=req.body
        if (!email && !password && !role && !fullName) {
             return res.status(400).send('Missing required fields');
    }
        try{
            const hashedPassword=await bcrypt.hash(password, 10);
//if the user registers as a client he will be added to the clients database
   if (role === 'client') {

      const existingEmail = await Client.findOne({ where: { email} });
      const existingUsername = await Client.findOne({ where: { fullName } });
      if (existingEmail || existingUsername) {
        return res.status(400).send('Email or username already exists');
      }

      await Client.create({
        email,
        fullName,
        password: hashedPassword,
      });

      return res.status(201).send('Client registered successfully');
//if the user registers as a seller he will be added to the sellers database
    } else if (role === 'seller') {

      const existingEmail = await Seller.findOne({ where: { email  } });
      const existingUsername = await Seller.findOne({ where: {fullName } });
      if (existingEmail || existingUsername) {
        return res.status(400).send( 'Email or username already exists' );
      }

      await Seller.create({
        email,
        fullName,
        password: hashedPassword,
      });

      return res.status(201).send('Seller registered successfully' );

    } else {
      return res.status(400).send('Invalid role' );
    }
        }
        catch(error){
            res.status(500).send(error)
            
        }
    }
    //handle login
    const loginUser=async (req,res)=>{
        const {email,password}=req.body
        if(!email && !password){
            return res.status(400).send('Missing required fields' );
        }

        try{
            let user = await Client.findOne({ where: { email  } });
            let role = 'client';

            if(!user){
                user = await Seller.findOne({ where: { email  } });
                role='seller'
            }
             if (!user) return res.status(404).send( 'User not found' );
            
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(401).send('Invalid credentials');
            }
            const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, {
             expiresIn: '2h',
            });
                 res.status(200).json({message: 'Login successful',token,userId: user.id,username: user.fullName, role});
        }
        catch(error){
            res.status(500).send(error.message)  
              
        }
    }
    module.exports = {
    registerUser,
    loginUser
};

