const { Router }=require("express");
const {User,Song,Artist}=require('../db')
const router=Router();
const multer = require('multer');
const path = require('path');
const express = require("express");
const bcrypt = require("bcryptjs");
const {userMiddleware,jwtPassword} =require("../config");
const jwt = require("jsonwebtoken");

const hashing = async(password)=>{

  const pass= password;
  const hashedPass = await bcrypt.hash(pass,8);

  return hashedPass;

}
const compareHash = async(password,dbPass)=>{

  const pass= password;
  const hashedPass = await bcrypt.hash(pass,8);

  const isMatch = await bcrypt.compare(password, dbPass);
return isMatch;
}


router.get("/getUsers",async(req,res)=>{
const allUser = await User.find({});
res.send(allUser)

})

router.post("/signup",async (req,res)=>{
    
    const username=req.body.username;
    const password=req.body.password;
    const hashedPass =await hashing(password);

    try {
        const existingUser = await User.findOne({
            username: username
        });

        if (existingUser) {
            return res.status(411).json({
                message: "Username already taken/Incorrect inputs"
            });
        }

        const user = await User.create({
            username: username,
            password: hashedPass
        });
     const token = jwt.sign({username:username},jwtPassword)
        res.status(200).json({
            msg: "User created successfully!!!",
            name: username,
            token:token
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            message: "Internal server error"
        });
    }

})

router.post("/signin",async (req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    let val=await User.findOne({
      username:username,
  })
    const hashedPass =await compareHash(password,val.password);
   if(!hashedPass){
    res.send("password not matched");
    return;
   }

        if(hashedPass){
           const token = jwt.sign({username:username},jwtPassword);
            res.status(200).json({
                msg:"signed in sucessfully!!!",
                name:val.username,
                token:token
                
            })
        }
        else{
            return res.status(403).json({
                msg: "Error while login",
              });
        }

})

router.post("/addSong",async (req,res)=>{
    
    const songName=req.body.songName;
    const songLink=req.body.songLink;


    try {
        const existingUser = await Song.findOne({
            songName: songName
        });

        if (existingUser) {
            return res.status(411).json({
                message: "song already taken/Incorrect inputs",
                type:existingUser,
            });
        }

        const user = await Song.create({
            songName: songName,
            songLink: songLink
        });

        res.status(200).json({
            msg: "song added successfully!!!",
           songName:songName
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            message: "Internal server error"
        });
    }

})

router.get("/getSongs",userMiddleware,async(req,res) => {

  const token = req.headers["authorization"];
  // console.log("token: ",token);

    const allSong = await Song.find({});
    res.send(allSong);
})

//geting a user

router.post("/oneUser",async (req,res) => {
const username = req.body.username;

try {
    const user = await User.findOne({username:username});

    if (user) {
        return res.status(200).send(user);
    }
     else{
        return res.status(411).send("user not exist")
     }

} catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
        message: "Internal server error"
    });
}
})

//adding playlist songs
router.put("/playlist",userMiddleware,async (req,res) => {

const song =req.body.playlist;
const username = req.body.username;

try {
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { $push: { favSongs: song } }, 
      { new: true } // Options: return the updated document
    );

    if (updatedUser) {
      res.status(200).send('Song added to favorite songs');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating user');
  }
});

//handle friend request
router.put("/friendRequest",async (req,res) => {

const from =req.body.from;
const to = req.body.to;
const cause = req.body.cause;

if(cause == "request"){
    try {
        const updatedUser = await User.findOneAndUpdate(
          { username: to },
          { $push: { friendRequest: from } }, 
          { new: true } // Options: return the updated document
        );
    
        if (updatedUser) {
          res.status(200).send('Request added to User');
        } else {
          res.status(404).send('User not found');
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Error updating user');
      }
}else if(cause == "accept"){
    try {
        const updatedUser1 = await User.findOneAndUpdate(
          { username: to },
          { 
            $push: { friends: from }, 
            $pull: { friendRequest: from }
          },
          { new: true } // Options: return the updated document
        );
        const updatedUser2 = await User.findOneAndUpdate(
          { username: from },
          { $push: { friends: to } }, 
          { new: true } // Options: return the updated document
        );
    
        if (updatedUser1 && updatedUser2) {
          res.status(200).send('friend added to User');
        } else {
          res.status(404).send('User not found');
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Error updating user');
      }
}
});

router.put("/playlistName",userMiddleware, async (req,res) => {

const playlistName =req.body.title;
const username = req.body.username;

try {
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { $set: { playlist: playlistName } }, 
      { new: true } // Options: return the updated document
    );

    if (updatedUser) {
      res.status(200).send(playlistName);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating user');
  }
});
//for artist

router.post("/signupArtist",async (req,res)=>{
    
  const username=req.body.username;
  const password=req.body.password;
  const hashedPass=await hashing(password);

  try {
      const existingUser = await Artist.findOne({
          username: username
      });

      if (existingUser) {
          return res.status(411).json({
              message: "Username already taken/Incorrect inputs"
          });
      }

      const user = await Artist.create({
          username: username,
          password: hashedPass
      });

      res.status(200).json({
          msg: "User created successfully!!!",
          name: username,
      });
  } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
          message: "Internal server error"
      });
  }

})

router.post("/signinArtist",async (req,res)=>{
  const username=req.body.username;
  const password=req.body.password;
  const hashedPass =await compareHash(password);
  if(!hashedPass){
   res.send("password not matched");
   return;
  }


 
      let val=await Artist.findOne({
          username:username,
          password:hashedPass,
      })
      if(val){
         
          res.status(200).json({
              msg:"signed in sucessfully!!!",
              name:val.username,
              
          })
      }
      else{
          return res.status(403).json({
              msg: "Error while login",
            });
      }

})
router.put("/privateName", async (req,res) => {

  const playlistName =req.body.title;
  const username = req.body.username;
  
  try {
      const updatedUser = await User.findOneAndUpdate(
        { username: username },
        { $set: { privateName: playlistName } }, 
        { new: true } // Options: return the updated document
      );
  
      if (updatedUser) {
        res.status(200).send("playlist name added");
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating user');
    }
  });
  router.put("/privatePlaylist",userMiddleware,async (req,res) => {

    const song =req.body.playlist;
    const username = req.body.username;
    
    try {
        const updatedUser = await User.findOneAndUpdate(
          { username: username },
          { $push: { privateSongs: song } }, 
          { new: true } // Options: return the updated document
        );
    
        if (updatedUser) {
          res.status(200).send('Song added to favorite songs');
        } else {
          res.status(404).send('User not found');
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Error updating user');
      }
    });


//handle upload
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../frontend/public/songs'),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
// Init upload
const upload = multer({ storage }).single('music');
// Upload endpoint
router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file selected' });
    }
    res.status(200).json({ fileName: req.file.filename, filePath: `/songs/${req.file.filename}` });
  });
});

// Serve static files from the React router
router.use(express.static(path.join(__dirname, '../../frontend/public')));



    

module.exports=router


