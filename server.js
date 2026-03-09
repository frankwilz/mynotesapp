require('dotenv').config();
const mongoose = require('mongoose');
const { createApp } = require('./app');

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingEnvVars.length) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const app = createApp({ serveStatic: true });

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI)
  .then(()=> {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('DB connection error:', err.message);
    process.exit(1);
  });
