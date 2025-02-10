import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import env from 'dotenv';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
env.config();

const app = express();
const PORT = 3000;
let db; // Declare a variable to hold the database object

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const secretKey = process.env.JWT_SECRET || 'defaultsecretkey';

// Create MongoClient
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('AarogyaSaarthi'); // Database name
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Authenticate token middleware
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access Denied: No token provided' });
    }
  
    jwt.verify(token, 'love', (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
      req.userId = decoded.userId;  // Store userId in req
      next();
    });
};

// Login route
app.post('/login', async (req, res) => {
  const { user, password } = req.body;
  try {
    const result = await db.collection('Login Info').findOne({ user });
    if (result) {
      const storedHashedPassword = result.password;
      const match = password === storedHashedPassword;
      const active = result.is_active;
      
      if (active && match) {
        const userId = result._id;
        const token = jwt.sign({ userId }, 'love', { expiresIn: '7d' });
        res.status(200).json({ userId, message: 'Login successful', token });
      } else {
        res.status(401).send('Invalid credentials');
      }
    } else {
      res.send("User is not registered. Try to Contact Us");
    }
  } catch (err) {
    console.log(err);
  }
});

// Add staff route
app.post('/add_staff', authenticateToken, async (req, res) => {
  const userID = req.userId;  // Ensure this is properly set
  const { 
    emp_id,
    f_name,
    l_name,
    email,
    age,
    date,
    phone,
    gender,
  } = req.body;
  
  const createdAt = new Date();
  try {
    // Check if employee exists
    const existingStaff = await db.collection('Staff').findOne({ emp_id });

    if (!existingStaff) {
      await db.collection('Staff').insertOne({
        userID,
        emp_id,
        f_name,
        l_name,
        email,
        age,
        date,
        phone,
        gender,
        createdAt,
      });

      res.status(200).json({ message: 'Staff added successfully' });
    } else {
      res.status(400).json({ message: "Employee is already registered" }); // Use 400 for client error
    }
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ message: "Internal Server Error" }); // Return a proper response
  }
});


// Add patient route
app.post('/add_patient', authenticateToken, async (req, res) => {
  const userID = req.userId;  // Ensure this is properly set
  const { 
    pat_id,
    name,
    age,
    blood_type,
    gender,
    medical_condition,
    doa,
    doctor,
    insurance,
    room_no,
    adm_type,
    medication,
    test_result,
    room_type,
  } = req.body;
  
  const createdAt = new Date();
  try {
    // Check if Patient data already feeded
    const existingPatient = await db.collection('Patient').findOne({ 'Patient ID': pat_id });

    if (!existingPatient) {
      await db.collection('Patient').insertOne({
        userID,
        "Patient ID": pat_id,
          Name: name,
          Age: age,
          Gender: gender,
          "Blood Type": blood_type,
          "Medical Condition": medical_condition,
          "Date of Admission": doa,
          Doctor: doctor,
          "Insurance Provider": insurance,
          "Room Number": room_no,
          "Admission Type": adm_type,
          Medication: medication,
          "Test Results": test_result,
          "Room type": room_type,
          createdAt: createdAt 
      });

      res.status(200).json({ message: 'Patient added successfully' });
    } else {
      res.status(400).json({ message: "Employee is already registered" }); // Use 400 for client error
    }
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ message: "Internal Server Error" }); // Return a proper response
  }
});


// Add resources route
app.post('/add_resources', authenticateToken, async (req, res) => {
  const userID = req.userId; // Ensure this is properly set
  let { resources, quantity } = req.body; // Extract resources and quantity from request body

  try {
    // Validate and parse the quantity
    quantity = parseInt(quantity);
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity. It must be a positive number.' });
    }

    // Update the specific resource field by incrementing its value
    const result = await db.collection('Resources').updateOne(
      { userId: userID }, 
      {
        $inc: { [resources]: quantity }, 
      }
    );

    // Check if the update was successful
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Resource added successfully.' });
    } else {
      res.status(404).json({ message: 'Resource not found or no changes made.' });
    }
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ALl Current Patient
app.get('/patients', async (req, res) => {
  try {
    console.log("Fetching patients...");
    
    // Fetch data properly
    const existingPatients = await db.collection('Patient').find({}).toArray();
    
    res.json(existingPatients);
  } catch (error) {
    console.error('Error fetching patients:', error.message);
    res.status(500).send('Server error');
  }
});

app.get('/past_patients', async (req, res)=>{
  try {
    console.log("Fetching patients...");
    
    // Fetch data properly
    const existingPatients = await db.collection('PastPatient').find({}).toArray();
    
    res.json(existingPatients);
  } catch (error) {
    console.error('Error fetching patients:', error.message);
    res.status(500).send('Server error');
  }
});

app.get('/auth', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Authenticated' });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
