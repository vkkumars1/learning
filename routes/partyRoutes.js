// -------USER PERSPECTIVE ROUTES HERE---------------

import express from 'express';
//enable routes here basically in server.js file we basically hit many end points to play with collection documents 
//but by this code with more length and unorganized 
//to organize data we use routes
import {jwtAuthMiddleware,generateToken} from '../jwt.js';
const router = express.Router();
import { User } from "./../modals/user.js";
import { Party } from "../modals/party.js";
// to check if the user is admin then user will allow to manage data of parties

const checkAdminRole = async(userID)=>{
 try{
   const user = await User.findById(userID);
  //  means return true if role === admin
   return user.role === "admin";
 }catch(err){
  return false;
 }
}
router.get('/', async (req, res) => {
    try{
        const data = await Party.find();
        console.log("data fetched");
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
});


//post data for party who are standing for election

router.post('/',jwtAuthMiddleware,async(req,res)=>{
  try{
    // req.user = payload
    if(!  checkAdminRole(req.user.userData.id))
        return res.status(403).json({message:"User has not access for this role"});
      //data which we manually enter by sending post request in postman
      //bodyparser extracts the data and modify into json object/js object which nodejs understands
    const data = req.body
    //basically database/collection-modal uska object banate hain taki data ka structure newUser object me aajaye and new values insert krde
    const newParty = new Party(data);
    const response  = await newParty.save();
   
    res.status(200).json({response:response});

  }catch(err){
    console.log(err);
    res.status(500).json({error:"internal server error"});
  }
});



//PARTY DATA UPDATE

router.put('/:partyID',jwtAuthMiddleware,async (req,res)=>{
  try{
    if(!  checkAdminRole(req.user.userData.id))
       //403 - no access
        return res.status(403).json({message:"User has not access for this role"});
    const partyId= req.params.partyID;   //extract id from params as a variable 
    const updatedData = req.body; //updated data which we will send in a body of the request
    const response =  await Party.findByIdAndUpdate(partyId,updatedData,{
        new: true, // to get updated data as a response
        runValidators: true //like while creating modal we definded required in each field so it will validate while updating document:jo required fields hain is it there or not or unique
    }); // find record/document through array of objects then update the corrosponsing data
    if(!response){
        return res.status(404).json({error:"Party not found"});
    }
    console.log('Party data updated');
    res.status(200).json(response);
  }catch(err){
    console.log(err);
    res.status(500).json({error:"internal server error"});
  }
})
//PARTY DATA DELETE
router.delete('/:partyID',jwtAuthMiddleware,async (req,res)=>{
try{
  if(!  checkAdminRole(req.user.userData.id))
  return res.status(403).json({message:"User has not access for this role"});
    const partyID = req.params.partyID;
    const response =  await Party.findByIdAndDelete(partyID); // find record/document through array of objects then update the corrosponsing data
    if(!response){
        return res.status(404).json({error:"user not founded "});
    }
    console.log('data deleted');
    res.status(200).json({message:"person deleted successfully"});
}catch(err){
    console.log(err);
    res.status(500).json({error:"internal server error"});
}
})

//Lets start voting
router.post('/vote/:partyID',jwtAuthMiddleware,async (req,res)=>{
 try{
  const partyID = req.params.partyID;
 
  //get the party data by id
   const party = await Party.findById(partyID);
   if(!party){
    //400 user not found bad request nhi mila
    return res.status(400).json({message:"Party Not Found"});
   }
   const userID = req.user.userData.id;
   const user = await User.findById(userID);
  
   if(!user){
    return res.status(400).json({message:"User Not Found"});
   }
   if(user.isVoted){
    return res.status(400).json({message:"You have already voted"});
  
   }
   //if user is admin then its not allowed to proceed furthur
   if(user.role == "admin"){
    res.status(403).json({message: "Admin not allowed to vote"})
   }
   
  //now user is not admin and not voted now login of voting below
  //updated the object under votes array
  party.votes.push({user:userID});
  //updated vote count of particular selected party
  party.voteCount++;
  // saved updated data in db
  await party.save();
  // update the user document also as user voted now
  user.isVoted = true;
  await user.save();
  
  res.status(200).json({message:"Voted successfully"});
 }catch(err){
  console.log(err);
    res.status(500).json({error:"internal server error"});
 }
});

// Vote count-list of parties acc to their votes-descending order 

router.get('/vote/count',async(req,res)=>{
try{
  //find the parties with vote count jiske jyada wo pehle :desc
  const party = await Party.find().sort({voteCount: 'desc'});
  // now map the record we get in party in desc order
  const record = party.map((data)=>{
    ///data slicing with mapping
      return {
      party:data.party,
      count:data.voteCount
      }
  });
  res.status(200).json(record);
}catch(err){
  console.log(err);
    res.status(500).json({error:"internal server error"});
}
});
export default router;