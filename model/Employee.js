import { Schema, model } from "mongoose";

const employeeSchema = new Schema({
    name: String,
    salary: Number,
    role: String
})

export default model("Employee", employeeSchema)