import express from "express";
import mongoose from "mongoose";
import cron from "node-cron";

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection
mongoose.connect("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Employee Schema
const EmployeeSchema = new mongoose.Schema({
  emp_id: Number,
  first_name: String,
  last_name: String,
  email: String,
  Salary: Number, // Annual salary
  bank_account: String,
  Net_Salary: Number, // Monthly salary after tax deduction
});

const Employee = mongoose.model("Staff", EmployeeSchema);

// Dummy Hospital Bank Account
let hospitalBankBalance = 100000000; // ₹100M initial balance

// Function to process salary payments
const processSalaries = async () => {
  console.log("Processing salaries...");
  const employees = await Employee.find({});

  if (employees.length === 0) {
    console.log("No employees found.");
    return;
  }

  employees.forEach((employee) => {
    const monthlySalary = employee.Net_Salary / 12; // Convert annual to monthly salary
    
    if (hospitalBankBalance >= monthlySalary) {
      hospitalBankBalance -= monthlySalary;
      console.log(
        `Paid ₹${monthlySalary.toFixed(2)} to ${employee.first_name} ${employee.last_name} (Acc: ${employee.bank_account})`
      );
    } else {
      console.log(
        `Insufficient funds! Cannot pay ${employee.first_name} ${employee.last_name}`
      );
    }
  });

  console.log(`Remaining hospital balance: ₹${hospitalBankBalance.toFixed(2)}`);
};

// Schedule salary processing on the 3rd of every month at 10 AM
cron.schedule("0 10 3 * *", () => {
  processSalaries();
});

// API Endpoint to trigger salary processing manually
app.get("/pay-salaries", async (req, res) => {
  await processSalaries();
  res.json({ message: "Salary processing completed!" });
});

// API Endpoint to check hospital balance
app.get("/balance", (req, res) => {
  res.json({ hospitalBankBalance });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
