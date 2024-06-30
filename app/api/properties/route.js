import connectDB from "@/config/db";
import Property from '@/models/Property'


//GET api/properties - fetches all of the properties in the database
export const GET = async (request) =>{
    try {
        await connectDB();

        const propertiesData = await Property.find({});

        return new Response(JSON.stringify(propertiesData), {status: 200})
    } catch (error) {
        console.log(error);
        return new Response('Something went wrong', {status: 500})
    }
}