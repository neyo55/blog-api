require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const postsRouter = require('./routes/posts');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

app.use(cors());
app.use(express.json());
app.use('/api/posts', postsRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Blog API!');
});

app.get('/health', (req, res) => res.status(200).send('OK'));

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;

























// require('dotenv').config(); // Load environment variables

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const postsRouter = require('./routes/posts');

// const app = express();
// const port = process.env.PORT || 3000;
// const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blog-api';

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

// if (process.env.NODE_ENV !== 'test') {
//   connectDB();
// }

// app.use(cors());
// app.use(express.json());
// app.use('/api/posts', postsRouter);

// app.get('/', (req, res) => {
//   res.send('Welcome to the Blog API!');
// });

// app.get('/health', (req, res) => res.status(200).send('OK'));

// if (process.env.NODE_ENV !== 'test') {
//   app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
//   });
// }

// module.exports = app;

































