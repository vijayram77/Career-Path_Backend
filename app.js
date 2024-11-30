const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const db = require("./config/mongoConnection")

const app = express();

app.use(cookieParser());

app.use((req, res, next) => {
    const origin = req.headers.origin; // Get the request's origin
    res.header('Access-Control-Allow-Origin', origin); // Dynamically set the origin
    res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow necessary headers
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
    next();
  });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const loginRouter = require("./routes/LoginRouter");
const logoutRouter = require("./routes/LogoutRouter");
const signupRouter = require("./routes/signupRouter");
const resumeRouter = require("./routes/ResumeMaker");
const loggedIn = require("./routes/Loggedin");

app.use("/", resumeRouter);
app.use("/logout", logoutRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/loggedin", loggedIn);

app.listen(4000);
