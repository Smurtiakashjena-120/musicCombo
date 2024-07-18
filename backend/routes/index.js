const { Router }=require("express");
const router=Router();
const userRouter=require("./user");


router.use("/user",userRouter);




router.get("/",(req,res)=>{
    res.send("hello from delta side")
})










module.exports=router