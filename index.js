const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 9090;

// Middleware to parse JSON in request bodies
app.use(express.json());
app.use(express.static('static'));

// Load student data from data.json
let students;
try {
  students = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));
} catch (error) {
  console.error('Error reading data.json:', error);
  students = [];
}

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/index.html'));
});

// API Endpoint: Retrieve students above threshold
app.post('/students/above-threshold', (req, res) => {
  const { threshold } = req.body;

  // Validate threshold
  if (typeof threshold !== 'number' || threshold < 0) {
    return res.status(400).json({ error: "Invalid threshold value. It must be a non-negative number." });
  }

  // Filter students based on the threshold
  const filteredStudents = students.filter(student => student.total > threshold);

  res.status(200).json({
    count: filteredStudents.length,
    students: filteredStudents
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});