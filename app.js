const express = require('express');
const app = express();

app.use(express.static('src'));

const PORT = 8000;

app.listen(PORT, () => {
  console.log('Server running on port 8000');
});
