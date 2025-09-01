const express = require('express');
const app = express();
const port = 4000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('dashboard', { title: 'Dashboard', message: 'Welcome to the Dashboard!' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});