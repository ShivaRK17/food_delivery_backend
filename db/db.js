const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URL

const dbconn = async () => {
    await mongoose.connect(MONGO_URI);
    console.log('db connected');
}

module.exports = dbconn