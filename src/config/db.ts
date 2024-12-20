import mongoose from "mongoose"

export const connectDB = async (uri: string) => {
    console.log('Connected to MongoDB')
    return await mongoose.connect(uri);
}