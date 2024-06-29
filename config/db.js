import mongoose from 'mongoose';

let connected = false;

const connectDB = async () =>{
    mongoose.set('strictQuery', true);

    //If the db is already connected, do not connect again
    if(connected){
        console.log("MongoDB is already connected...");
        return;
    }

    //Connect to Mongo DB
    try {
        await mongoose.connect(process.env.MONGO_URI);
        connected = true;
        console.log('MongoDB is now connected...')
    } catch (error) {
        console.log("MongoDB could not connect: ", error);
    }
}

export default connectDB;