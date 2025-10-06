const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const yaml = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// init passport config
require('./config/passport-github')(passport);

const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(cookieParser());
app.use(
  cors({
    origin: '*', // or list your frontend and Swagger origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const noteRoutes = require('./routes/notes');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tags');
const ouathRoutes = require('./routes/oauth');
app.get('/', (req, res) => res.send('Mini Social Notes API is running'));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/oauth', ouathRoutes);

// Swagger
const swaggerDocument = yaml.load(path.join(__dirname, 'docs', 'swagger.yaml'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URL;

// ✅ Clean database connection for both app & test environments
async function start() {
  if (!mongoUri) {
    console.error('❌ Missing MONGO_URL in .env file');
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('✅ Successfully connected to MongoDB');

    // Only start server if not in testing mode
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

// 👇 Start only if file is run directly
if (require.main === module) start();

// 👇 Export app for Jest and other modules
module.exports = { app, start };
