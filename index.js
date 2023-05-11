const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());
// middle ware

// mongodb Connection

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.NAME}:${process.env.PASSWORD}@cluster0.4slfm2g.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// connect
async function dbConnect() {
  try {
    await client.connect();
    console.log(`db Connect`);
  } catch (error) {
    const message = error.message;
    const name = error.name;
    console.log(message, name);
  }
}

dbConnect().catch((error) => console.log(error.message));
// connect
// mongodb Connection

// Course collection
const courseListCollection = client
  .db("Course_lists")
  .collection("Course_items");
// Course collection
// contact message collection
const contactMessageCollection = client
  .db("Course_lists")
  .collection("Message_doc");
// contact message collection
// register collection
const registerCollection = client.db("Course_lists").collection("RegisterInfo");
// register collection
// course route
app.get("/", async (req, res) => {
  res.send({ success: true, message: "Welcome" });
});
// All Courses Get
app.get("/course", async (req, res) => {
  try {
    const query = {};
    const result = await courseListCollection.find(query).toArray();
    if (result) {
      res.send({ success: true, data: result });
    } else {
      res.send({ success: false, data: "Not Data Access Try Again and Again" });
    }
  } catch (error) {
    const message = error.message;
    console.log(message);
  }
});
// All Courses Get
// get single course route create
app.get("/course/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const result = await courseListCollection.findOne(query);
    if (result) {
      res.send({ success: true, data: result });
    } else {
      res.send({ success: false, message: "Not Found Try Again and again" });
    }
  } catch (error) {
    const message = error.message;
    console.log(message);
  }
});
// get single course route create
// course route

// message doc post route
app.post("/message", async (req, res) => {
  try {
    const messageDoc = req.body;
    console.log(messageDoc);
    const updatedDoc = await contactMessageCollection.insertOne(messageDoc);
    if (updatedDoc) {
      res.send({ success: true, message: "Sent Success" });
    } else {
      res.send({
        success: false,
        message: "Provide valid Message Send And try Again",
      });
    }
  } catch (error) {
    const message = error.message;
    console.log(message);
  }
});
// message doc post route
// register data post route
app.post("/register", async (req, res) => {
  try {
    const registerInfo = req.body;
    const updateDoc = await registerCollection.insertOne(registerInfo);
    if (updateDoc) {
      res.send({ success: true, message: "Register Success" });
    } else {
      res.send({ success: false, message: "invalid Information" });
    }
  } catch (error) {
    console.log(error.message);
  }
});
// register data post route
// listen
app.listen(port, () => {
  console.log(`server is running port ${port}`);
});
// listen
