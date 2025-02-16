import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import mongoose from "mongoose";
import env from 'dotenv';
import cron from "node-cron";
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
env.config();

const app = express();
const PORT = process.env.PORT || 3000;
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

// Connect to MongoDB (Mongoose for salary processing)
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

// Employee Schema (Salary Management)
const EmployeeSchema = new mongoose.Schema({
  emp_id: Number,
  first_name: String,
  last_name: String,
  email: String,
  Salary: Number,
  bank_account: String,
  Net_Salary: Number,
});

const Employee = mongoose.model("Staff", EmployeeSchema);

// Dummy Hospital Bank Account
let hospitalBankBalance = 100000000; // ₹100M initial balance

// Function to calculate tax based on Indian tax slabs
const calculateTax = (annualSalary) => {
  let taxableIncome = Math.max(annualSalary - 50000, 0);
  let tax = 0;
  if (taxableIncome <= 250000) {
    tax = 0;
  } else if (taxableIncome <= 500000) {
    tax = (taxableIncome - 250000) * 0.05;
  } else if (taxableIncome <= 1000000) {
    tax = (250000 * 0.05) + (taxableIncome - 500000) * 0.20;
  } else {
    tax = (250000 * 0.05) + (500000 * 0.20) + (taxableIncome - 1000000) * 0.30;
  }
  return tax;
};

// Payroll Processing API
app.post("/process_salaries", authenticateToken, async (req, res) => {
  try {
    const employees = await Employee.find({});
    let totalSalaryPaid = 0;

    employees.forEach(async (employee) => {
      const tax = calculateTax(employee.Salary);
      const monthlySalary = (employee.Salary - tax) / 12;
      totalSalaryPaid += monthlySalary;

      await Employee.updateOne(
        { emp_id: employee.emp_id },
        { $set: { Net_Salary: monthlySalary } }
      );
    });

    if (hospitalBankBalance >= totalSalaryPaid) {
      hospitalBankBalance -= totalSalaryPaid;
      res.status(200).json({ message: "Salaries processed successfully", totalSalaryPaid });
    } else {
      res.status(400).json({ message: "Insufficient funds" });
    }
  } catch (err) {
    console.error("Error processing salaries:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Automate Salary Processing Every Month
cron.schedule("0 0 1 * *", async () => {
  console.log("Running Monthly Salary Processing...");
  try {
    const employees = await Employee.find({});
    let totalSalaryPaid = 0;

    employees.forEach(async (employee) => {
      const tax = calculateTax(employee.Salary);
      const monthlySalary = (employee.Salary - tax) / 12;
      totalSalaryPaid += monthlySalary;

      await Employee.updateOne(
        { emp_id: employee.emp_id },
        { $set: { Net_Salary: monthlySalary } }
      );
    });

    if (hospitalBankBalance >= totalSalaryPaid) {
      hospitalBankBalance -= totalSalaryPaid;
      console.log("Salaries processed successfully. Total paid:", totalSalaryPaid);
    } else {
      console.log("Insufficient funds for salary payment.");
    }
  } catch (err) {
    console.error("Error in scheduled salary processing:", err);
  }
});

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

app.get('/staff', async (req, res)=>{
  try {
    
    // Fetch data properly
    const existingPatients = await db.collection('Staff').find({}).toArray();
    
    res.json(existingPatients);
  } catch (error) {
    console.error('Error fetching patients:', error.message);
    res.status(500).send('Server error');
  }
});

app.get('/all_resources', async (req, res)=>{
  try {
    const userID = req.userId
    // Fetch data properly
    const existingResources = await db.collection('Resources').find({userId: '679a4af819ee2872f4d16825'}).toArray();
    
    res.json(existingResources);
  } catch (error) {
    console.error('Error fetching Resources:', error.message);
    res.status(500).send('Server error');
  }
});

app.get('/auth', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Authenticated' });
});

app.get("/", (req, res) => {
  res.send("Hello, Render!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
