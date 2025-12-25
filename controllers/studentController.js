import Student from "../models/student.js";

export function getStudent(req, res) {
  Student.find().then((data) => {
    res.json(data);
  });
}

export function saveStudent(req,res){
    const student = new Student({
      name: req.body.name,
      age: req.body.age,
      steam: req.body.steam,
      email: req.body.email,
    });
    student
      .save()
      .then(() => {
        res.json({
          massage: "Student save successfully",
        });
      })
      .catch(() => {
        massage: "Error occured in Student save";
      });
}