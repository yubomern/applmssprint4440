const express = require('express');
const router = express.Router();
const Event = require('../models/meetevent');
const ics = require('ics');

router.get('/', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

router.post('/', async (req, res) => {
  const ev = await Event.create(req.body);
  // Generate ICS invitation
  const { error, value } = ics.createEvent({
    title: ev.title,
    start: [ev.start.getFullYear(), ev.start.getMonth()+1, ev.start.getDate(), ev.start.getHours(), ev.start.getMinutes()],
    duration: { minutes: (ev.end - ev.start) / 60000 },
    description: `Meeting link: ${ev.meetLink}`
  });
  ev.ics = value;
  await ev.save();
  res.json(ev);
});

router.get('/download/:id', async (req, res) => {
  const ev = await Event.findById(req.params.id);
  res.setHeader('Content-Type', 'text/calendar');
  res.send(ev.ics);
});

module.exports = router;
