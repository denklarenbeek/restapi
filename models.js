'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var pumpwatchSchema = new Schema({
  pw_type:	String,
  q_analog:	Number,
  q_ip:	Number
});

var CameraSchema = new Schema({
  camera_type:	String,
  camera_mounting:	String,
  camera_lens:	String,
  camera_position: String,
  updatedAt: Date
});

CameraSchema.method("update", function(updates, callback) {
  Object.assign(this, updates, {updatedAt: new Date()});
  this.parent().parent().save(callback);
});

var monitorSchema = new Schema({
  monitor_type:	String,
  monitor_mounting:	String,
  monitor_position: String
});

var DocumentSchema = new Schema({
  dID:	Number,
  lID:	Number,
  createdAt:	{type: Date, default: Date.now},
  updatedAt:	{type: Date, default: Date.now},
  type:	String,
  pw: [pumpwatchSchema],
  ups:	Boolean,
  work_monitor:	Boolean,
  hybrid_quad:	Number,
  fuel:	Boolean,
  car:	Boolean,
  blacklist:	Boolean,
  rdw:	Boolean,
  shop:	Boolean,
  service:	Boolean,
  pumpcheck:	Boolean,
  autoalert:	Boolean,
  portal:	Boolean,
  bbi:	Boolean,
  poe_switch:	Number,
  projects_costs:	Number,
  travel_costs:	Number,
  platform:	Boolean,
  ftp_cable:	Number,
  pipe:	Number,
  cameras:	[CameraSchema],
  monitors: [monitorSchema],
  pole_4mtr:	Number,
  pole_6mtr:	Number,
  open_vpn:	Boolean,
  signature: Boolean

});

DocumentSchema.method("update", function(updates, callback) {
  Object.assign(this, updates, {updatedAt: new Date()});
  this.parent().save(callback);
});

var LocationSchema = new Schema({
  lID: Number,
  salution:	String,
  lastname:	String,
  firstname: String,
  company: 	String,
  street:	String,
  zippcode:	String,
  city:	String,
  distance:	String,
  createdAt:	{type: Date, default: Date.now},
  updatedAt:	{type: Date, default: Date.now},
  documents: [DocumentSchema]
});

var Location = mongoose.model("Location", LocationSchema);

module.exports.Location = Location;
