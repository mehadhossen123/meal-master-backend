const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// --- middleware ---
app.use(cors()); // to stop cors error 
app.use(express.json()); // to read data 
// ------------------------------------

const user = process.env.mongodb_user;
const pass = process.env.mongoDb_pass;
const uri = `mongodb+srv://${user}:${pass}@cluster0.g6tkuix.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("mealMaser");
    const userCollection = database.collection("user");
    const expenseCollection = database.collection("expenses");
    const mealCollection = database.collection("meal");

    app.post("/user", async (req, res) => {
      try {
        const user = req.body;
        // ডাটাবেসে চেক করা
        console.log("user in the database ", user);
        const query = { email: user?.email };
        const existUser = await userCollection.findOne(query);

        if (existUser) {
          return res.send({ message: "User already exist", insertedId: null });
        }

        const result = await userCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });

    // // user related api is here //
    // @@ ********************* @@@//
    app.get("/user", async (req, res) => {
      try {
        const email = req?.query?.email;
        if (!email) {
          return res.status(401).send({ message: "Unauthorized access" });
        }
        const result = await userCollection.findOne({ email: email });
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });

    app.get("/user/all", async (req, res) => {
      try {
        const result = await userCollection.find().toArray();
        res.status(200).send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });

    // Expense related api is here //
    // @@ ********************* @@@//
    app.post("/expenses", async (req, res) => {
      try {
        const userEmail = req.query.email;
        const product = req.body;
        if (!userEmail) {
          return res.status(401).send({ message: "Unauthorized access " });
        }
        const user = await userCollection.findOne({ email: userEmail });

        if (!user || user.email !== userEmail) {
          return res.status(401).send({ message: "Unauthorized access" });
        }
        const result = await expenseCollection.insertOne(product);
        res.status(201).send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });

    // Meal related api is here //
    // @@ ********************* @@@//

    app.post("/meal", async (req, res) => {
      try {
        const userEmail = req.query.email;
        const mealData = req.body;

        if (!userEmail) {
          return res.status(401).send({ message: "Unauthorized access " });
        }
        const result=await mealCollection.insertOne(mealData);
        res.status(200).send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
  } finally {
    // এখানে client.close() দিবেন না, তাহলে সার্ভার কানেকশন বন্ধ হয়ে যাবে
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("this is the meal management system");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
