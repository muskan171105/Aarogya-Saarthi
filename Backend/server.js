import express from 'express';
import cors from 'cors';
// import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
// import nodemailer from 'nodemailer';
// import apiRoutes from './routes/api.js';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import env from 'dotenv';
import jwt from 'jsonwebtoken';
// import multer from "multer";
import path from "path";
// import fs from "fs";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;
// const saltRounds = 10;
env.config();


// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


console.log('MongoDB URI:', process.env.MONGODB_URI);

const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function connectToDatabase() {
  try {
    // Connect the client to the server
    await client.connect();
    db = client.db('AarogyaSaarthi'); // database name
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

let db; // Declare a variable to hold the database object


// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.post('/login', async (req, res) => {
  
  const { user, password } = req.body;
  try{
    // checking for already register
    const result = await db.collection('Login Info').findOne({user: user});

     if (result) {
      const storedHashedPassword = result.password;

      const match = password === storedHashedPassword;

      const active = result.is_active
      if(active){
        if (match) {
          const userId = result._id
          const token = jwt.sign({ userId }, `hijsjxmxslqmzkak`, { expiresIn: '1h' });
          res.status(200).json({ userId: userId, message: 'Login successful',token });
        } else {
          res.status(401).send('Invalid credentials');
        }
      } else {
        res.status(401).send('Invalid credentials');
      }
  
     }else{
      res.send("User is not registered. Try to Contact Us");
     }
    }catch (err) {
        console.log(err);
    } 
});




// Sample Route
// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
