const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'API is running' }));

const PORT = process.env.PORT || 5000;
if (require.main === module) {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // needed for testing