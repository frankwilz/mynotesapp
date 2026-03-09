require('dotenv').config();
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const { createApp } = require('../../app');

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];

let dbConnectionPromise = null;
let cachedHandler = null;

function getMissingEnvVars() {
  return requiredEnvVars.filter((key) => !process.env[key]);
}

function getErrorResponse(message, statusCode = 500) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ msg: message }),
  };
}

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;

  if (!dbConnectionPromise) {
    dbConnectionPromise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 7000,
    })
      .catch((error) => {
        dbConnectionPromise = null;
        throw error;
      });
  }

  await dbConnectionPromise;
}

async function getHandler() {
  if (cachedHandler) return cachedHandler;

  const missingEnvVars = getMissingEnvVars();
  if (missingEnvVars.length) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }

  if (/localhost|127\.0\.0\.1/.test(process.env.MONGO_URI)) {
    throw new Error('MONGO_URI must be a public MongoDB URI (for example MongoDB Atlas) when deployed to Netlify');
  }

  await connectDatabase();
  cachedHandler = serverless(createApp(), { basePath: '/.netlify/functions/api' });
  return cachedHandler;
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const handler = await getHandler();
    return handler(event, context);
  } catch (error) {
    console.error('Netlify function error:', error.message);
    if (error.message.startsWith('Missing required environment variables:')) {
      return getErrorResponse(error.message, 500);
    }
    if (error.message.startsWith('MONGO_URI must be a public MongoDB URI')) {
      return getErrorResponse(error.message, 500);
    }
    return getErrorResponse('Server error', 500);
  }
};
