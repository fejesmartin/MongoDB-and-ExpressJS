// Import required modules
import express from "express";
import mongoose from "mongoose";
import Employee from "./model/Employee.js";
import Budget from "./model/Budget.js";

const app = express();
const port = 6969;
const ceoId = '646c70abfc080c1afa863b12';
let companyBudget = 0;

// Connect to MongoDB and set up server
mongoose.connect('mongodb+srv://fejesmartin:Martinka19980@soloproject1.belw892.mongodb.net/employeeManagement')
    .then(() => {
        // Retrieve the company budget from the database
        Budget.findOne({_id: "646c7fc1c8273f29f6181cc3"})
            .then(response => companyBudget = response.companyBudget);
        
        // Start the server
        app.listen(port, () => console.log(`Server is running on ${port}`));
    });

app.use(express.json()); // Enable body parsing

// Middleware to check authorization
// If the CEO's ID is used, send a 404 error; otherwise, proceed to the next middleware
app.use(["/employees/search/:id", "/employees/fire/:id", "employees/raise/:id"], async (req, res, next) => {
    req.params.id == ceoId ? res.status(404).send("You are unauthorized to access this info") : next();
});

// Middleware to log the company budget
app.use("/", (req, res, next) => {
    console.log("COMPANY BUDGET: ", companyBudget);
    next();
});

// Endpoint to search for an employee by ID
app.get("/employees/search/:id", (req, res) => {
    Employee.findOne({_id: req.params.id})
        .then(response => res.send(response)); // Respond with the employee details in text/html format
});

// Endpoint to retrieve all employees except the CEO
app.get("/employees", (req, res) => {
    Employee.find({_id: {$ne: ceoId}})
        .then(response => res.json(response)); // Respond with the employee details in JSON format
});

// Endpoint to hire a new employee
app.post("/employees/hire", (req, res) => {
    Employee.create({
        name: req.body.name,
        salary: req.body.salary,
        role: req.body.role
    })
        .then(response => res.send(response))
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error occurred");
        });
});

// Endpoint to fire an employee
app.delete("/employees/fire/:id", (req, res) => {
    Employee.deleteOne({_id: req.params.id})
        .then(response => res.send("Employee has been fired"))
        .catch(err => {
            console.error(err);
            res.status(500).send("Internal Server Error");
        });
});

// Endpoint to give a raise to an employee
app.patch("/employees/raise/:id", (req, res) => {
    Employee.findByIdAndUpdate(req.params.id, {
        salary: req.body.salary
    })
        .then(response => res.send(response))
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error occurred");
        });
});

// Endpoint to create a new transaction for the budget
app.patch("/budget/new/transaction", async (req, res) => {
    try {
        // Retrieve all employees
        let allEmployee = await Employee.find();
        
        // Retrieve the budget and its transaction history
        let transactions = await Budget.findOne({_id: "646c7fc1c8273f29f6181cc3"});
        console.log(transactions);
        
        // Calculate the total amount to be deducted from the budget
        let amount = allEmployee.reduce((acc, curr) => {
            acc += curr.salary;
            
            // Add the current employee's salary to the transaction history
            transactions.transactionHistory = [...transactions.transactionHistory, {amount: curr.salary, reason: 'Monthly salary'}];
            
            return acc;
        }, 0);
        
        // Deduct the amount from the company budget
        transactions.companyBudget = transactions.companyBudget - amount;
        
        // Save the updated budget with the new transaction
        await transactions.save();
        
        // Update the company budget variable
        companyBudget = transactions.companyBudget;
        
        res.send("Employees have been paid");
    } catch (error) {
        console.log(error);
        res.status(500).send("Nem jó mááá");
    }
});
