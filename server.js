// ./server.js
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require("./middleware/credentials");
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Handle options credentials check - must be put before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data; In other words, form data
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

// root route
app.use("/", require("./routes/root"));

// register route
app.use('/register', require('./routes/register'));

// auth route
app.use('/auth', require('./routes/auth'));

// this is responsible for getting new access token when it expires, must be after the auth and before the verifyJWT
app.use('/refresh', require('./routes/refresh'));

// route for logout
app.use('/logout', require('./routes/logout'));

// all code after this line needs to go to verifyJWT mdlwre (routes above do not need authorization)
app.use(verifyJWT);

// employees (API) route
app.use("/employees", require("./routes/api/employees"));

// catch-all for pages that do not exist (404)
// app.use('/')
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type("txt").send("404 Not Found");
    }
});

// Custom error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
