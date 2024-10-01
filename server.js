const express = require('express');
const routes = require('./routes');
const app = express();

// Set the port from environment variable or default to 5000
const port = process.env.PORT || 5000;

// Load all routes from the routes/index.js file
app.use('/', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
