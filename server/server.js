const express = require('express');
const cors = require('cors');
require('dotenv').config();

const weatherRouter = require('./routes/weather');

const app = express();
const PORT = 5001; // Force port 5001

app.use(cors());
app.use(express.json());

// Mount the weather routes
app.use('/api/weather', weatherRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 