'use strict';

var express = require('express');
var app = express();
var routes = require('./routes');
var http = require('http');
var mongoose = require('mongoose');
var corser = require('corser');

//Parse body into JSON
var jsonParser = require("body-parser").json;

//Include color logging in the terminal
var logger = require("morgan");
app.use(logger("dev"));

//Parse the request
app.use(jsonParser());

//Mongoose integration
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/locationdocuments");

var db = mongoose.connection;

//Error handling for Database connection
db.on("error", function(err){
  console.error("connection error:", err);
});

db.once("open", function(){
  console.log("db connection succesful setup");
});

//// Configure CORS (Cross-Origin Resource Sharing) Headers
app.use(corser.create({
    methods: corser.simpleMethods.concat(["PUT", "DELETE", "OPTIONS"]),
    requestHeaders: corser.simpleRequestHeaders.concat(["X-Requested-With"])
}));
app.all('*', function(request, response, next) {
    response.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With,Authorization,Access-Control-Allow-Origin');
    response.header('Access-Control-Allow-Methods', 'POST,GET,DELETE');
    response.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    if(req.method === "OPTIONS") {
        res.header("Acces-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
        return res.status(200).json({});
      }
    next();
});

// var handleCORS = function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", '*');
//   res.header("Access-Control-Allow-Headers", 'X-Requested-With, Content-Type');
//   res.header("Acces-Control-Allow-Methods", 'GET, POST, OPTIONS, PUT, DELETE');
//   next();
// }
//
// app.use(handleCORS);

// app.use('*', function(req, res, next){
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   if(req.method === "OPTIONS") {
//     res.header("Acces-Control-Allow-Methods", "GET, PUT, POST, DELETE");
//     return res.status(200).json({});
//   }
//   next();
// });

app.use("/locations", routes);

//Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not found");
  err.status = 404;
  next(err);
});

// Custom Error handler 500
app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

var port = process.env.PORT || 3000;

http.createServer(app).listen(port, function(){
  console.log("Express server is listening on port " + port);
});

// app.listen(port, function(){
//   console.log("Express server is listening on port " + port);
// });
