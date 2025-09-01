const express = require('express');
const app = express();
const port = 4000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('dashboard', { title: 'Dashboard', message: 'Welcome to the Dashboard!' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login', message: 'Please log in to continue.' });
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Register', message: 'Create a new account.' });
});

// 404 page (not found)
app.use((req, res) => {
  res.render('error', { title: '404 Not Found', message: 'Page not found' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});