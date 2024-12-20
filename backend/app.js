const express = require('express');
const eventRoutes = require('./routes/eventRoutes');
const app = express();

app.use(express.json());
app.use('/api', eventRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});