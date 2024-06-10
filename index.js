const express = require("express");

const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zunrmyl.mongodb.net/?retryWrites=true&w=majority`;

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
    client.connect();

    // ======================== all collection here ==========================

    const projectCollection = client.db("projecttest").collection("info");

    const productsCollection = client.db("projecttest").collection("products");

    // ========================== get post update modify here ==================
    app.get("/info", async (req, res) => {
      const result = await projectCollection.find().toArray();
      res.send(result);
    });

    // products collection get all products

    app.get("/laptops", async (req, res) => {
      try {
        const result = await productsCollection.find().toArray();
        if (!result || result.length === 0) {
          console.log("No products found");
          res.status(404).send("No products found");
        } else {
          res.send(result);
        }
      } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // get fixed data

    app.get("/laptops/:productId", async (req, res) => {
      const productId = req.params.productId;
      try {
        const product = await productsCollection.findOne({
          _id: new ObjectId(productId),
        });
        if (!product) {
          res.status(404).json({ message: "Product not found" });
          return;
        }
        res.json(product);
      } catch (error) {
        console.error("Error retrieving product details:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    app.get("/info/:name", async (req, res) => {
      const name = req.params.name;
      const query = { name: name };
      const result = await projectCollection.findOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("project test runing");
});

app.listen(port, () => {
  console.log(`project is runing on port ${port}`);
});
