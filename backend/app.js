const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/diary', require('./routes/diary'));
app.use('/api/anime', require('./routes/anime'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/work', require('./routes/work'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/pomodoro', require('./routes/pomodoro'));
app.use('/api/timetable', require('./routes/timetable'));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;