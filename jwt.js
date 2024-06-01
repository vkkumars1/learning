//JWT - JSON WEB TOKEN --
// basically it is statelessness -means under this server doesn't have to depend on db 
//client with login with some cred then server validate it and send's jwt token
//by which if user want's to access some more pages so if user hit any other page url 
// then if user contain's that token so it will go request to server with token server will verify that token with signature concept
// then token got verifies it authorize user to access that page

// JWT token structure:
// Headers.payload.signature 
import jwt from 'jsonwebtoken';
//first when user hit the request to the server while signup then jwt generates token for that user using sign function- which contains user payload and jwt secret key using this key server use to create jwt token and verify to when user hit login request or to access another routes of same domain

// now we are creating jwt token when user firstly send req to the server with info
const generateToken = (userData)=>{
  //generate a new token with sign function and userData
  return jwt.sign({userData},process.env.JWT_SECRET,{expiresIn: 30000});
}
//to verify the jwt token coming from the headers of the request
const jwtAuthMiddleware = (req,res,next)=>{
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).json({error: 'token not found'});
       //extract the jwt token from the request header
    //    token are genrally sended inside authorization section with Bearer space header.payload.signature structured token
    // split(' ') space se pehle Bearer ko alag krke 0 index me bhejdiya and token ko 1 index me so we want token so we are writing [1] index
       const token = req.headers.authorization.split(' ')[1];
    //    agar req me token hi na ho toh this error will compare
       if(!token) return res.status(401).json({error: 'unauthorized'})

       try{
        //verify the token using verifu function which includes two params token and secret key
        // when creating jwt it includes payload which includes user info means credentials
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        //we will send this pay load to request key/object ->user-key
        req.user = decoded;

        next();

       }catch(err){
        console.log(err);
        // token agar galat diya then verfiy ni hopayega then it will throw erro
        res.status(500).json({error:"invalid token"});
      }
       }
       export { generateToken, jwtAuthMiddleware };
