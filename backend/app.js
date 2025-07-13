require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const postsRouter = require('./routes/posts');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/blog-db'; // fallback if .env fails

console.log(`🌍 Using Mongo URI: ${mongoUri}`);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/posts', postsRouter);

// Basic route
app.get('/', (req, res) => {
  res.send('Neyo55 Blog API!');
});

// Health check
app.get('/health', (req, res) => res.status(200).send('OK'));

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
}

module.exports = app;










// // backend/app.js
// require('dotenv').config(); // Load environment variables

// // Import necessary modules
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const postsRouter = require('./routes/posts');

// // Initialize the Express application
// const app = express();
// const port = process.env.PORT || 3000;
// const mongoUri = process.env.MONGO_URI;

// // Default MongoDB URI if not set in environment variables
// const connectDB = async () => {
//   try {
//     await mongoose.connect(mongoUri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     console.log('Connected to MongoDB');
//   } catch (err) {
//     console.error('MongoDB connection error:', err);
//     process.exit(1);
//   }
// };

// // Connect to MongoDB if not in test environment
// if (process.env.NODE_ENV !== 'test') {
//   connectDB();
// }

// // Middleware setup
// app.use(cors());
// app.use(express.json());
// app.use('/api/posts', postsRouter);

// // Root endpoint
// app.get('/', (req, res) => {
//   res.send('Neyo Blog API!');
// });

// // Health check endpoint
// app.get('/health', (req, res) => res.status(200).send('OK'));

// // Start the server if not in test environment
// if (process.env.NODE_ENV !== 'test') {
//   app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
//   });
// }

// // Export the app for testing or further configuration
// module.exports = app;



