const mongoose = require('mongoose');

connectToDb().then((res) => console.log("Connect to database")).catch(err => console.log(err));

async function connectToDb() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatapp_clone');

}

module.exports = connectToDb;