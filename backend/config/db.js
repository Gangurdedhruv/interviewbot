import mongoose from 'mongoose';
export const connection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`); // Corrected string interpolation
    } catch (error) {
        console.error(`Error: ${error.message}`); // Corrected string interpolation
        process.exit(1); // Exit with failure if there's an error
    }
};
