require('dotenv').config({ path: '../backend.env.example' });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server running'
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
