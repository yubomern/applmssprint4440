const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
  title: String,
  start: Date,
  end: Date,
  studentName: String,
  meetLink: String
});
module.exports = mongoose.model('MeetEvent', EventSchema);
