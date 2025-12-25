import User from "../models/users.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';    

export function createUser(req,res){

  if(req.body.role == "admin"){
    if(req.user !=null ){
      if(req.user.role != 'admin'){
        res.status(403).json({
          massage: "You not autherize to create an account "
        })
        return
      }
    }else{ 
      res.status(403).json(
        { message: "You are not autherize to create admin accounts .please login first. " 
        });
      return;
    }
  }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role
    });

    user.save()
      .then(() => {
        res.json({
          message: "User created successfully!"
        });
      })
      .catch(() =>{
        res.json({
          message: "An error occurred while creating the user."
        })
      })
}


export function loginUser(req,res){
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      } else {
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ message: "Invalid password" });
        } else {
          //genarate token and send to user
          const token = jwt.sign(
            {
              email: user.email,
              role: user.role,
              firstname: user.firstname,
              lastname: user.lastname,
              img: user.img
            },
            "sulakshana@256",
          );

          return res.status(200).json({ message: "Login successful", user: user, token: token });
        }
      }
    })
    .catch(() => {
      res.status(500).json({ message: "An error occurred during login" });
    });
}


export function isAdmin(req){
  if(req.user != null && req.user.role === 'admin'){
    return true;
  }else{
    return false
  }
}