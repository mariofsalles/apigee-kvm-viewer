const express = require('express');
const app = express();

app.use(express.static('src'));

app.listen(8000, () => {
  console.log('Server running on port 8000');
});
