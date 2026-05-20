//dependencies
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

connectDB();

app.use(express.json());
//main auth route
app.use('/api/users', authRoutes);
//unhandle routes
app.use((req, res) => res.status(404).json({ message: 'Route not found'}));
//PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running in development mode on port ${PORT}`));