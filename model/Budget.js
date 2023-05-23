import { Schema, model } from "mongoose";

const budgetSchema = new Schema({
    companyBudget: {
        type:  Number,
        default: 1000000000
    },
    transactionHistory: [
        {
            amount: Number,
            createdAt: {
                type: Date,
                default: Date.now
            },
            reason: String
        }
    ]
})

export default model("Budget", budgetSchema)