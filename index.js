const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middlewar
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vcouptk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const serviceCollection= client.db('carDoctor').collection('services');

    app.get('/services', async(req,res)=>{
        const cursor = serviceCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get("/services/:id", async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const option = {
            projection: {service_id: 1, title: 1,price: 1, img: 1},
        };
        const result = await serviceCollection.findOne(query,option);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/" , (req,res) =>{
    res.send("server running................")
})
app.listen(port, ()=>{
    console.log(`server is running on port:${port}`)
})