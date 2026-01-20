
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const questionRoutes = require('./routes/questionRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'NCAA Aviation Quiz API is Online', status: 'Operational' });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
