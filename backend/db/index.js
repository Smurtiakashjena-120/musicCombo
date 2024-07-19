const mongoose=require("mongoose");

// mongoose.connect('mongodb://localhost:27017/Delta');
mongoose.connect('mongodb+srv://akash:harami309@smurtiakash.spfvdef.mongodb.net/deltaAkash');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    friendRequest: {
        type: [String], 
        default: []    
    },
    friends: {
        type: [String], 
        default: []    
    },
    playlist: {
        type: String,
        default:null
    },
    favSongs: {
        type: [String], 
        default: []    
    },
    privateName: {
        type: String,
        default:null
    },
    privateSongs: {
        type: [String], 
        default: []    
    }
    
});
const artistSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
Songs: {
        type: [String], 
        default: []    
    },
    
});
const songSchema = new mongoose.Schema({
    songName: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
       
    },
    songLink: {
        type: String,
        required: true,
        unique: true,
        
    }
    
});


const User= mongoose.model("hacker",userSchema);
const Song= mongoose.model("songs",songSchema);
const Artist= mongoose.model("Artist",songSchema);


module.exports={
    User,Song,Artist
}