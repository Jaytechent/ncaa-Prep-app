const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');

const connectDB        = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const questionRoutes   = require('./routes/questionRoutes');
const userRoutes       = require('./routes/userRoutes');
const parseRoutes      = require('./routes/parseRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/parse',     parseRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'NCAA Aviation Quiz API is Online', status: 'Operational' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});