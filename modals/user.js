import bcrypt from 'bcrypt';
import mongoose  from "mongoose";
//database and collection's blueprint
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    mobile: {
        type: String,
    },                                                               
    email: {
        type: String,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    aadharCardNumber: {
        type: Number,
        required: true,
        unique:true
    },
    password: {
        required: true,
        type: String,
        unqiue: true
    },
    role: {
        type: String,
        enum: ['voter','admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
});

//bcrypt pre function before document saving

// now before saving data to mongodb cluster we will call mongoose pre middleware with 'save' as a callback function
userSchema.pre('save',async function(next){
    const user = this; //fetches the data of userschema
    //hashing passowrd now with salt if password is getting modified
    if(!user.isModified('password')) return next();
    // next() ->gives signal to mongoose that save that document into database data verified 
    try{
          //salting
          const salt = await bcrypt.genSalt(10);
        //   10-now. of rounds more number of rounds more the complexity of hasing algo but its good to take 10 rounds otherwise it will take time
          //random salt-string at last of password and join that
          //hashing 
          const hashedPassword = await bcrypt.hash(user.password,salt);
        // now it converts into hash string which includes  original password and salt 
        // now override the hashedpassword to original passoword
        user.password = hashedPassword;
        next();
    }catch(err){
        next(err);
    }
})

//bcrypt compare password function if calls under any document
userSchema.methods.comparePassword = async function(candidatePassword){
    try{
    //comparing password --with password when user sends with req.body while login and already stored hash password 
//basically it extracts the salt from stored hash password then it hashes that entered password while login with that salt 
// then it matches if both are same then it will return value otherwise error

// this.password refers to the documnet under which comparePassword function is being called
     const isMatch = await bcrypt.compare(candidatePassword,this.password);
     
     return isMatch;
    }catch(err){
        throw err;
    }
}
//collection's modal and collection will be in plural and small letter 
const User = mongoose.model('User',userSchema);
export { User };
