const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://deepak:23092002@cluster0.tgq6aos.mongodb.net/iNotebook";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("connected to mongo successfully");
    } catch (e) {
        console.log(e);
    }
}

module.exports = connectToMongo;

