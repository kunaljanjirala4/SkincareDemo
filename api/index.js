// api/index.js

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let contactSubmissions = [];
let quizResults = [];

app.post('/api/contact', (req, res) => {
  const data = req.body;
  contactSubmissions.push(data);
  res.status(200).json({ message: 'Contact form submitted successfully', data });
});

app.post('/api/quiz', (req, res) => {
  const data = req.body;
  quizResults.push(data);
  res.status(200).json({ message: 'Quiz submitted successfully', data });
});

app.get('/api/debug/contact', (req, res) => {
  res.status(200).json(contactSubmissions);
});

app.get('/api/debug/quiz', (req, res) => {
  res.status(200).json(quizResults);
});

module.exports = app;
