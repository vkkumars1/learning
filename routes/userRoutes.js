// -------USER PERSPECTIVE ROUTES HERE---------------

import express from 'express';
//enable routes here basically in server.js file we basically hit many end points to play with collection documents 
//but by this code with more length and unorganized 
//to organize data we use routes
import {jwtAuthMiddleware,generateToken} from './../jwt.js';
const router = express.Router();
import { User } from "./../modals/user.js";
router.get('/',jwtAuthMiddleware, async (req, res) => {
    try{
        const data = await User.find();
        console.log("data fetched");
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
});


// --USER SIGNUP--


router.post('/signup',async(req,res)=>{
    try{
        //data which we manually enter by sending post request in postman
        //bodyparser extracts the data and modify into json object/js object which nodejs understands
      const data = req.body
      //basically database/collection-modal uska object banate hain taki data ka structure newUser object me aajaye and new values insert krde
      const newUser = new User(data);
      const response  = await newUser.save();
      const payload = {
        id: response.id
      }
    //   convert object to string
      console.log(JSON.stringify(payload));
      const token = generateToken(payload);
      res.status(200).json({response:response,token:token});

    }catch(err){
      console.log(err);
      res.status(500).json({error:"internal server error"});
    }
});



// USER LOGIN WITH GOVT ID PROOF

router.post('/login',async(req,res)=>{
     try{
        //extract username and password from the req.body
        const {aadharCardNumber,password} = req.body;

        //find the user in the db either its already signuped or not
        const user = await User.findOne({aadharCardNumber:aadharCardNumber});

        if(!user || !(await user.comparePassword(password))){
            // in authentication 401-unautherised
            return res.status(401).json({error: "invalid username or password"});
        }

        // agar milgya toh generate token just like we generated while signed up 
        const payload = {
            id: user.id
        }   
        const token = generateToken(payload);
        res.json({token});
     }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
     }
})

//USER PROFILE


router.get('/profile',jwtAuthMiddleware,async(req,res) =>{
    //basically here jo token ka payload me user ka mini data hoga uski id lekar db se puri profile fetch krke display krni hain
   try{
    const userData = req.user;
    // inside userData there is payload
    const userId = userData.userData.id
    // using payload data fetching document which includes profile of user
    const user = await User.findOne({id:userId});
    
    res.status(200).json({user});
   }catch(err){
    console.log(err);
        res.status(500).json({error:"internal server error"});
   }
})

//USER PROFILE PASSWORD UPDATE

router.put('/profile/password',jwtAuthMiddleware,async (req,res)=>{
  try{
    const userId= req.user.id;   //extract id from payload data stored under req.user 
   
    // logic begins here
    const {currentPassword,newPassword} = req.body;

    // now find the user by it's id in the payload

    const user = await User.findOne({id:userId});
    // if current password u entered wrong it will return error otherwise it will 
    // update password in the database and before saving into
    //  database pre function will call and password will be saved as hashed
    if(!(await user.comparePassword(currentPassword))){
        // in authentication 401-unautherised
        return res.status(401).json({error: "invalid username or password"});
    }
    user.password = newPassword;
    // save the updated document/object in the database 
    await user.save();
    
    console.log('Password updated');
    res.status(200).json(response);
  }catch(err){
    console.log(err);
    res.status(500).json({error:"internal server error"});
  }
})
router.delete('/:id',async (req,res)=>{
try{
    const ID = req.params.id;
    const response =  await User.findByIdAndDelete(ID); // find record/document through array of objects then update the corrosponsing data
    if(!response){
        return res.status(404).json({error:"user not founded "});
    }
    console.log('data deleted   ');
    res.status(200).json({message:"person deleted successfully"});
}catch(err){
    console.log(err);
    res.status(500).json({error:"internal server error"});
}
})
// module.exports = router;
export default router;