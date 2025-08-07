const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const connectToDb = require('./src/db/db.config');

const app = express();
const PORT = process.env.PORT || 5000;


console.log(process.env.PORT);

app.use(express.json());

app.get('/', (req, res) => {
    res.send('WhatsApp Web Clone Backend is running');
});

app.listen(PORT, () => {
    connectToDb();
    console.log(`Server is running on port ${PORT}`);
});