import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
//db established connection basically mongodb string connect horha ya ni this manages
const db = mongoose.connection;

db.on('connected', () => {
    console.log("connected to mongodb server");
});

db.on('error', (err) => {
    console.log("connection error", err);
});

db.on('disconnected', () => {
    console.log("mongodb server disconnected");
});

export { db };
