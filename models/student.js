import mongoose from "mongoose";

// how make and connect to student model 
const studentSchema = mongoose.Schema({
        name : String,
        age : Number,
        steam : String ,
        email : String
    })
    // parameters are model name and model structure 
const Student = mongoose.model("students" ,studentSchema )

export default Student;