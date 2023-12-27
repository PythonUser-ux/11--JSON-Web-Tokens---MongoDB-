// a middleware is really anything between the request and the response
// there are three types of middlewares: built-in, customed and third-parties

// always remember the waterfall logic for router handlers!

const path = require('path');
const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors'); // to resolve CORS (Cross-Origin Resource Sharing) Issues // CORS enhances security by preventing unintended cross-origin requests. Without CORS, browsers restrict cross-origin requests by default.
const corsOptions = require('./config/corsOption');
const {logger} = require("./middleware/logEvents");
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
// const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

const PORT = process.env.PORT || 3500;

// Connect to mongoDB, if this part fails we don't want to listen for any other connections
connectDB(); //now it is ready to connect


// custom middleware logger
// app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
// app.use(credentials)

// app.use is used to add middlewares to all incoming routers

app.use(cors(corsOptions)); // we put this line as soon as possible but after *app.use(logger);*
// by using this now I can run "fetch('http://localhost:3500');" from dev tools in more websites than before the introduction of this line

// built-in middleware to handle urlencoded form data
// 'content-type: application/x-www-form-rulencoded'
app.use(express.urlencoded({extended: false}));

// built-in middleware for json
app.use(express.json());       //  any incoming request with a JSON payload will have that payload parsed, and the resulting JSON data will be available in req.body for further processing in your route handlers.

// middleware for cookies
app.use(cookieParser());

// built-in middleware to serve static files
app.use(express.static(path.join(__dirname, '/public')));  // now this folder is accessible by the client to serve static files

// Route handlers
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT); // note we add this line here because we want to protect from this point on
app.use('/employees', require('./routes/api/employees'));


app.all('/*', (req, res)=>{          // this is the "catch all" or "fallback" case, it matches / followed by whatever
    res.status(404);
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views','404.html')); // custom 404, in this case we send a .html file
    } else if (req.accepts('json')){
        res.json({error: "404 Not Found"}); // in this case we send a .json file
    } else {res.type('txt').send("404 Not Found")}; // in this case we send a .txt file // Adding .type('txt') is a way to explicitly specify the content type as plain text
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.message);
})

// this should always be at the end of the server.js file, it allows us to start the server



// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://mongotutszz:testing123@cluster0.fgxvf5k.mongodb.net/CompanyDB?retryWrites=true&w=majority";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
// app.listen(PORT, () => console.log(`server running on port ${PORT}`));

// instead of "on" because we are listening for this event one time, 'open' is the event we are listening for, it is emitted once the the mongoDB is successfully connected
mongoose.connection.once('connected', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});

// Export the Express API
// module.exports = app
