const express=require('express');
const app=express();
const port=3000;



app.get('/',(req,res)=>{
    res.send("this is the meal management system")
})


app.listen(port,()=>{
    console.log(`the port is running ${port}`)
})