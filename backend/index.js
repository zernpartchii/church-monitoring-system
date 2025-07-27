const express = require("express");
const cors = require('cors');
const app = express();

const web = require('./app/routes/web');

app.use(cors())
app.use(express.json());

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use('/api', web);