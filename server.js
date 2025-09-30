const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const yaml = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const noteRoutes = require('./routes/notes');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tags');

app.get('/', (req, res) => res.send('Mini Social Notes API is running'));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);

// Swagger
const swaggerDocument = yaml.load(path.join(__dirname, 'docs', 'swagger.yaml'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;

async function start() {
  const mongoUri = process.env.MONGO_URL; // 👈 using MONGO_URL consistently

  if (!mongoUri) {
    console.error('❌ Missing MONGO_URL in .env file');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri); // modern Mongoose doesn’t need options
    console.log('✅ Successfully connected to MongoDB Atlas');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

start();
