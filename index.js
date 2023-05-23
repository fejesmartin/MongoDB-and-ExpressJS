import mongoose from "mongoose";
import Employee from "./model/Employee.js";


let data = {
    companyBudget: 1000000,
    employees: [
        {
            id:1,
            name: "Bossy Bob",
            salary: 750000,
            role: "CEO"
        },
        {
            id:2,
            name: "Toxic Tiffany",
            salary: 350000,
            role: "HR"
        },
        {
            id:3,
            name: "Trusty Tom",
            salary: 500000,
            role: "Team lead"
        },
        {
            id:4,
            name: "Hardworking Harley",
            salary: 500000,
            role: "Software developer"
        },
        {
            id:5,
            name: "Test Elek",
            salary: 450000,
            role: "Software tester"
        },
        {
            id:6,
            name: "Alcoholic Martin",
            salary: 200000,
            role: "Maintenance"
        },
    ],
    transactionHistory: [
        {
            id:'T1',
            amount: 0,
            to:1
        }
    ]
}


mongoose.connect('mongodb+srv://fejesmartin:Martinka19980@soloproject1.belw892.mongodb.net/employeeManagement')
.then(() => {
    Employee.create(data.employees).then(() => {
        console.log("Database have been populated.");
        mongoose.disconnect()
    }).catch((err) => {
        console.log(err);
    })
})