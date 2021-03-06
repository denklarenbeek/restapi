'use strict';

var express = require("express");
var router = express.Router();
var Location = require("./models").Location;

//Find a selected location
router.param("lID",  function(req, res, next, id){
  Location.findById(id, function(err, doc){
    if(err) return next(err);
    if(!doc) {
      err =  new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    req.location = doc;
    return next();
  })
});

//RouterParam for document ID's
router.param("dID", function(req, res, next, id){
  req.documents = req.location.documents.id(id);
  // console.log(req.documents);
  if(!req.documents) {
    err =  new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});

//RouterParam for camera ID's
router.param("cID", function(req, res, next, id){
  req.cameras = req.documents.cameras.id(id);
  if(!req.cameras) {
    err =  new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});

//RouterParam for pumpwatch ID's
router.param("pID", function(req, res, next, id){
  req.pumpwatch = req.documents.pumpwatch.id(id);
  if(!req.pumpwatch) {
    err =  new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});

//RouterParam for monitor ID's
router.param("mID", function(req, res, next, id){
  req.monitors = req.documents.monitors.id(id);
  console.log(req.monitors);
  if(!req.monitors) {
    err =  new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});


//GET /locations
//Get all the locations
router.get("/", function(req, res, next) {
  Location.find({}, null, function(err, locations){

    //If error send them to error handler
    if(err) return next(err);

    //Return all the locations
    res.json(locations);
  });

});

//GET /locations/:lID
//Get a specific location
router.get("/:lID", function(req, res, next) {
  res.json(req.location);
});

//PUT /locations/:lID
//Edit a specific location
router.put("/:lID", function(req, res, next) {
  console.log(req.body);
  req.location.update(req.body, function(err, result){
    if(err) return next(err);
    res.json(result);
  });
});

//DELETE /locations/:lID
//Delete a specific location
router.delete("/:lID", function(req, res) {
    req.location.remove(function(err, location){
      if(err) return next(err);
      res.json(location);
    });
});

//POST /locations
//Create a new location
router.post("/", function(req, res, next) {
  var location = new Location(req.body);
  location.save(function(err, location){
    if(err) return next(err);
    res.status(201);
    res.json(location);
  });
});

////////////// DOCUMENT ROUTERS ////////////
//GET /locations/:lID/documents
router.get("/:lID/documents/:dID", function(req, res, next) {
  console.log('Get document');
  res.json(req.documents);
});

//POST /locations/:lid/documents
//Create a new document
router.post("/:lID/documents", function(req, res, next) {
  console.log(req.location.documents);
  req.location.documents.push(req.body);
  req.location.save(function(err, location){
    if(err) return next(err);
    res.status(201);
    res.json(location);
  });
});

//PUT /locations/:lID/documents/:dID
//Edit a specific document
router.put("/:lID/documents/:dID", function(req, res) {
  req.documents.update(req.body, function(err, result){
    if(err) return next(err);
    res.json(result);
  });
});

//DELETE /locations/:lID/documents/:dID
//Delete a specific document
router.delete("/:lID/documents/:dID", function(req, res) {
  req.documents.remove(function(err){
    req.location.save(function(err, location){
      if(err) return next(err);
      res.json(location);
    });
  });
});

////////////// CAMERA ROUTERS ////////////

//GET locations/:lID/documents/:dID/cameras
//GET all cameras
router.get("/:lID/documents/:dID/cameras", function(req, res, next) {
  Location.find({}, null, function(err, cameras){

    //If error send them to error handler
    if(err) return next(err);

    //Return all the locations
    res.json(cameras);
  });
});

//POST /locations/:lID/documents/:dID/cameras/
//Create a new camera
router.post("/:lID/documents/:dID/cameras", function(req, res, next) {
  req.documents.cameras.push(req.body);
  req.location.save(function(err, camera){
    if(err) return next(err);
    res.status(201);
    res.json(camera);
  });
});

//PUT /locations/:lID/documents/:dID/cameras/:cID
//Edit a specific document
router.put("/:lID/documents/:dID/cameras/:cID", function(req, res) {
  req.cameras.update(req.body, function(err, result){
    if(err) return next(err);
    res.json(result);
  });
});

//DELETE /locations/:lID/documents/:dID
//Delete a specific document
router.delete("/:lID/documents/:dID/cameras/:cID", function(req, res) {
  req.cameras.remove(function(err){
    req.location.save(function(err, location){
      if(err) return next(err);
      res.json(location);
    });
  });
});

////////////// PumpWatch ROUTERS ////////////

//POST /locations/:lID/documents/:dID/pumpwatch/
//Create a new pumpwatch
router.post("/:lID/documents/:dID/pumpwatch", function(req, res, next) {
  req.documents.pumpwatch.push(req.body);
  req.location.save(function(err, camera){
    if(err) return next(err);
    res.status(201);
    res.json(camera);
  });
});

//PUT /locations/:lID/documents/:dID/pumpwatch/:pID
//Edit a specific pumpwatch
router.put("/:lID/documents/:dID/pumpwatch/:pID", function(req, res) {
  req.pumpwatch.update(req.body, function(err, result){
    if(err) return next(err);
    res.json(result);
  });
});

//DELETE /locations/:lID/documents/:dID/pumpwatch/:pID
//Delete a specific pumpwatch
router.delete("/:lID/documents/:dID/pumpwatch/:pID", function(req, res) {
  req.pumpwatch.remove(function(err){
    req.location.save(function(err, location){
      if(err) return next(err);
      res.json(location);
    });
  });
});

////////////// PumpWatch ROUTERS ////////////

//POST /locations/:lID/documents/:dID/monitors/
//Create a new monitor
router.post("/:lID/documents/:dID/monitors", function(req, res, next) {
  req.documents.monitors.push(req.body);
  req.location.save(function(err, result){
    if(err) return next(err);
    res.status(201);
    res.json(result);
  });
});

//PUT /locations/:lID/documents/:dID/monitors/:mID
//Edit a specific monitor
router.put("/:lID/documents/:dID/monitors/:mID", function(req, res) {
  req.monitors.update(req.body, function(err, result){
    if(err) return next(err);
    res.json(result);
  });
});

//DELETE /locations/:lID/documents/:dID/monitors/:mID
//Delete a specific pumpwatch
router.delete("/:lID/documents/:dID/monitors/:mID", function(req, res) {
  req.monitors.remove(function(err){
    req.location.save(function(err, location){
      if(err) return next(err);
      res.json(location);
    });
  });
});

module.exports = router;
