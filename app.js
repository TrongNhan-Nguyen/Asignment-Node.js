const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const session = require('express-session');


const adminRoute = require("./src/routes/admin");
const loginRoute = require("./src/routes/login");
const studentRoute = require("./src/routes/student");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "src/views");
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("src/public"));
app.use(morgan("dev"));
app.use("/",loginRoute);
app.use("/admin", adminRoute);
app.use("/student",studentRoute);
mongoose
  .connect("mongodb://localhost/StudentManagement", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connection to MongoDB successfully"))
  .catch((err) => console.log(err));

  
// app.get("/",(req,res,next)=>{
//   res.redirect('/admin')
// })
app.listen(port, () =>
  console.log(`App listening on http://localhost:${port}`)
);

