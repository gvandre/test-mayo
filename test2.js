const express = require('express');
// Set up the express app
const app = express();
// get all todos
app.get('/api', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'todos retrieved successfully'
  })
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});