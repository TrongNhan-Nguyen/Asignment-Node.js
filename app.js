"use strict";
const nodemailer = require("nodemailer");
const SMTPConnection = require("nodemailer/lib/smtp-connection");
const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");
const Socks = require("socks").SocksClient;
const mongoose = require("mongoose");
const morgan = require("morgan");
const session = require("express-session");
const xoauth2 = require("xoauth2");
const adminRoute = require("./src/routes/admin");
const loginRoute = require("./src/routes/login");
const studentRoute = require("./src/routes/student");
const app = express();
const port = 3000;

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
mongoose
  .connect("mongodb://localhost/StudentManagement", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connection to MongoDB successfully"))
  .catch((err) => console.log(err));
/* Test nodemailer */
// const transporter =  nodemailer.createTransport({
//   service: "smtp.gmail.com",
//   port: 465,
//   secure: true, // upgrade later with STARTTLS
//   auth: {
//     user: "trasmail377@gmai..com",
//     pass: "nhan320377"
//   }
// });
// // verify connection configuration
// transporter.verify(function(error, success) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Server is ready to take our messages");
//   }
// });
/* End nodemailer */

app.listen(process.env.PORT || port, () =>
  console.log(`App listening on http://localhost:${port}`)
);
