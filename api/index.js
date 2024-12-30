require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('../routes/auth.routes');
const taskRoutes = require('../routes/task.routes');
const projectRoutes = require('../routes/project.routes');
const categoryRoutes = require('../routes/category.routes');
const labelRoutes = require('../routes/label.routes');
const errorHandler = require('../middleware/error-handler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

app.get('/api/test', (req, res) => {
res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString()
});
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/labels', labelRoutes);
// Error handling
app.use(errorHandler);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app; 