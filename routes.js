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

//Router to delete the document of the location
router.param("dID", function(req, res, next, id){
  console.log(req.documents);
  req.documents = req.location.documents.id(id);
  if(!req.documents) {
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

//POST /locations/:lid/documents
//Create a new document
router.post("/:lID/documents", function(req, res, next) {
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

//POST /locations/:lID/documents/:dID/cameras/:cID
//Create a new camera
router.post("/:lID/documents/:dID/cameras", function(req, res, next) {
  req.location.documents.cameras.push(req.body);
  req.location.documents.save(function(err, camera){
    if(err) return next(err);
    res.status(201);
    res.json(camera);
  });
});

module.exports = router;
