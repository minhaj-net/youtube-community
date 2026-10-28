require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const { setServers } = require("node:dns/promises");

setServers(["1.1.1.1", "8.8.8.8"]);



const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    console.log(`📡 API Base: http://localhost:${PORT}/api/v1`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('\nSIGINT received. Shutting down...');
    server.close(() => {
      process.exit(0);
    });
  });
};

startServer().catch((err) => {
  console.error('Fatal error during startup:', err);
  process.exit(1);
});

