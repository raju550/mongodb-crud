// @ts-nocheck
const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const uri =
  "mongodb+srv://raju550:158696@cluster0.5sjyg.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  // @ts-ignore
  useNewUrlParser: true,
  //   useUnifiedTopology: true,
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

client.connect((err) => {
  const postCollection = client.db("organicdb").collection("products");
  app.get("/products", (req, res) => {
    postCollection
      .find({})

      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.patch("/update/:id", (req, res) => {
    postCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: { price: req.body.price, quantity: req.body.quantity } }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });
  app.get("/product/:id", (req, res) => {
    postCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, document) => {
        res.send(document[0]);
      });
  });
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    postCollection.insertOne(product).then((result) => {
      console.log("added your product");
      res.redirect("/");
    });
  });
  app.delete("/delete/:id", (req, res) => {
    postCollection
      // @ts-ignore
      .deleteOne({ _id: ObjectId(req.params.id) })

      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });
});
app.listen(4001);
