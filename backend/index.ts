import express from 'express';
const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => {
  console.log('pinged..');
  res.send('pong');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
