const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
// const morgan = require("morgan");
const session = require("express-session");
const adminRoute = require("./src/routes/admin");
const loginRoute = require("./src/routes/login");
const studentRoute = require("./src/routes/student");
const app = express();
const port = process.env.PORT || 3000;
const { parse } = require("json2csv");
app.set("view engine", "ejs");
app.set("views", "src/views");
app.use(
  session({ secret: "PS10674", resave: false, saveUninitialized: false })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("src/public"));
// app.use(morgan("dev"));
app.use("/", loginRoute);
app.use("/admin", adminRoute);
app.use("/student", studentRoute);
// StudentManagement testImport
mongoose
  .connect("mongodb://localhost/StudentManagement", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connection to MongoDB successfully"))
  .catch((err) => console.log(err));

// app.get("/react", (req, res) => {
//   const isMobile = req.header("Accept").includes("application/json");
//   const student = {
//     name: "Nguyen Trong Nhan",
//     id: "PS10674",
//     email: "nhanntps10674@fpt.edu.vn",
//   };
//   if (isMobile) {
//     return res.send({student});
//   }
//   return res.send("Login on web");
// });
app.listen(port, () =>
  console.log(`App listening on http://localhost:${port}`)
);
