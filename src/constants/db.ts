import mongoose from "mongoose";

// Define a test schema
const testSchema = new mongoose.Schema({
    name: String
});

const Test = mongoose.model("Test", testSchema);

const insertTestData = async () => {
    try {
        const testDoc = new Test({ name: "Test Document" });
        await testDoc.save();
        console.log("Test document inserted.");
    } catch (error) {
        console.error("Error inserting test document:", error);
    }
};

export const connectDB = async (uri: string) => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected Successfully");
        await insertTestData();

    } catch (error) {
        console.error("MongoDB connection Failed:", error);
        process.exit(1);
    }

    mongoose.connection.on('disconnected', () => {
        console.log("🍃 MongoDB connection disconnected");
    });

    mongoose.connection.on('error', (error) => {
        console.error("🍃 MongoDB connection error:", error);
    });
}
