import mongoose from "mongoose";
//database and collection's blueprint
const partySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    
    votes: [
        
        //    ----user object id -------
        //array of objects-jitne number of objects utne hi numnber of votes basically
        {
         user: {
            type: mongoose.Schema.Types.ObjectId,
            //User collection-tells to fetch object id of the logged in user saved in databse under User modal
            ref: 'User',
            required: true
         }
        },

    //  --------time when user vote-------
        {
         votedAt: {
            // Mongoose ke andar hi Date Property
            type: Date,
            default: Date.now()
         }
        }



    ],
    voteCount: {
        type: Number,
        default: 0
    }
    
});


//collection's modal and collection will be in plural and small letter 
const Party = mongoose.model('Party',partySchema);
export { Party };
