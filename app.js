const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const db = require("./config/mongoConnection")

const app = express();

// Use cookie parser
app.use(cookieParser());

// Configure CORS with additional settings
const corsOptions = {
    origin: 'https://career-path-front-end-new.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials : true
};

app.use(cors(corsOptions));

// Add a route to handle OPTIONS requests explicitly
app.options("*", cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route definitions
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

// Start server
app.listen(4000, () => {
    // console.log("Server running on port 4000");
});
