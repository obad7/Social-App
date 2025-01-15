import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`MongoDB Connected Successfully`);
    } catch (error) {
        console.log(`error connecting to MongoDB: ${error.message}`);
    }
};

export default connectDB;