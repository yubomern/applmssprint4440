// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Showcase = require('../models/showcase');
const Company = require('./models/Company');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/eshop1', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Create a Showcase
app.post('/showcases', async (req, res) => {
  try {
    const showcase = new Showcase(req.body);
    await showcase.save();
    res.status(201).send(showcase);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Read all Showcases
app.get('/showcases', async (req, res) => {
  try {
    const showcases = await Showcase.find().populate('company');
    res.status(200).send(showcases);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read a single Showcase by ID
app.get('/showcases/:id', async (req, res) => {
  try {
    const showcase = await Showcase.findById(req.params.id).populate('company');
    if (!showcase) {
      return res.status(404).send();
    }
    res.status(200).send(showcase);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a Showcase by ID
app.patch('/showcases/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['type', 'caption', 'image', 'routerLink', 'priority', 'company'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const showcase = await Showcase.findById(req.params.id);

    if (!showcase) {
      return res.status(404).send();
    }

    updates.forEach(update => showcase[update] = req.body[update]);
    await showcase.save();

    res.status(200).send(showcase);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a Showcase by ID
app.delete('/showcases/:id', async (req, res) => {
  try {
    const showcase = await Showcase.findByIdAndDelete(req.params.id);

    if (!showcase) {
      return res.status(404).send();
    }

    res.status(200).send(showcase);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
