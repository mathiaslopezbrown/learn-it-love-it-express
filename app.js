const express = require('express');
const path = require('path');
const topicRoutes = require('./routes/topicRoutes');
const linkRoutes = require('./routes/linkRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (client-side JS and CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Request body parsing
app.use(express.urlencoded({ extended: false })); // HTML forms
app.use(express.json());                          // fetch() with JSON

// Routes
app.use('/', topicRoutes);
app.use('/', linkRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
