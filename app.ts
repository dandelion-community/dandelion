import express from 'express';

var app = express();

app.get('/', (req, res) => {
  res.send('Here it is, the aid app!');
});

app.listen(3000, () => {
  console.log('Ready: http://localhost:3000/');
});
