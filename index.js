const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ze0g6j8.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    await client.connect();
    const courseCollection = client.db("kidzy-school").collection('courseData');
    const userRolesCollection = client.db("kidzy-school").collection('usersRoles');
    // read all course data
    app.get('/courses', async(req,res)=>{
      const courses = await courseCollection.find().toArray();
      res.send(courses);
    })
    // add course
    app.post('/course', async(req,res)=>{
          const course = req.body;
          const result = await courseCollection.insertOne(course);
          res.send(result);
        })
    // user roles data 
    app.post('/users-role', async(req,res)=>{
      const userRoles = req.body;
      const result = await userRolesCollection.insertOne(userRoles);
      res.send(result);
    })
    app.get('/all-users-role', async(req,res)=>{
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await userRolesCollection.find(query).toArray();
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


app.get('/', (req, res) => {
  res.send('server is running');
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});