const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const mainRouter=require('./routes/index');
const cors=require('cors');



app.use(bodyParser.json());
app.use(cors());


app.use("/delta",mainRouter);

const PORT=3000;



app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})

