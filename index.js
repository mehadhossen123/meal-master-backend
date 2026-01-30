const express=require('express');
const cors = require("cors");
require('dotenv').config()

const { MongoClient, ServerApiVersion } = require("mongodb");
const app=express();
const port=3000;
const user = process.env.mongodb_user;
const pass = process.env.mongoDb_pass;

const uri=`mongodb+srv://${user}:${pass}@cluster0.g6tkuix.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    //    the collection is make here
    const database = client.db("mealMaser");
    const userCollection = database.collection("user");

    // post registered user into database
    app.post("/user", async (req, res) => {
      try {
        const user = req.body;
        const query={email:user?.email}
        const existUser =await userCollection.findOne(query)
        if(existUser){
            return res.send({message:"User already exist"})
        }else{
           
            const result=await userCollection.insertOne(user);
            res.send(result)
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("this is the meal management system")
})


app.listen(port,()=>{
    console.log(`the port is running ${port}`)
})