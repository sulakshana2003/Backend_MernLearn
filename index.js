import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
//import studentRouter from './routes/studentRouter.js';
import productRoute from './routes/productRoute.js';
import userRouter from './routes/userRouter.js';
import orderRouter from './routes/orderRoute.js';
import jwt, { decode } from 'jsonwebtoken';
import cors from 'cors';

const app = express();
app.use(cors());
mongoose
  .connect(
    "mongodb+srv://admin:admin123@project1.zaykqtz.mongodb.net/?appName=Project1"
  )
  .then(
    ()=>
        {
            console.log("connected to the database")
        } 
).catch(()=>{
    console.log("Database connection failed!");
});
//mongodb+srv://admin:admin123@project1.zaykqtz.mongodb.net/?appName=Project1
// req ek dn enne body parser ek athulin gihin 
// ek hind meka mulinm da gnn oni okkotm kalin 
//meka external library ekk 
app.use(bodyParser.json())

//token middleware
app.use((req,res,next)=>{
    const tokenString = req.headers['authorization'];
    if (tokenString != null) {
        const token = tokenString.replace('Bearer ', '');
        console.log("Token received:", token);

        jwt.verify(token, 'sulakshana@256', (err, decoded) => { 
            if (decoded != null) {
                console.log("Decoded token:", decoded);
                req.user = decoded; // Attach decoded token data to the request object
                next()
            }else {
                res.status(403).json({ message: "Invalid token" });
            }
        })
    }else {
        next();
    }
    
    
    //next();
});


//app.use("/students",studentRouter)


/* app.get("/",(req,res)=>{
    Student.find().then((data)=>{
        res.json(data)
    })
})


app.post("/",(req,res)=>{
    console.log(req.body)
    // how make and connect to student model 
    

    const student = new Student(
        {
            name : req.body.name,
            age : req.body.age,
            steam : req.body.steam,
            email : req.body.email
        }
    )
    student.save().then(()=>{
        res.json({
            massage: "Student save successfully"
        })
    }).catch(()=>{
        massage : "Error occured in Student save"
    })
}) */
app.use("/api/products",productRoute)
app.use("/api/orders", orderRouter)
app.use("/api/users", userRouter);

// port number and function to run 
// function run by app.listen so thats why we call function like this funct_name
// not like this funct_name() 
app.listen(3000, () =>{
    console.log("Sever is runnig on port 3000");
})




// 404 user's mistakes
// 500 server mistakes
// 200 ok everything is fine
// 403  unautherize access