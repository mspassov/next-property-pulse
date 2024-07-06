import connectDB from "@/config/db";
import Property from '@/models/Property'


//GET api/properties/user/:userId - fetches all properties for a given user
export const GET = async (request, {params}) =>{
    try {
        await connectDB();

        const userID = params.userId;

        const propertiesData = await Property.find({owner: userID});

        return new Response(JSON.stringify(propertiesData), {status: 200})
    } catch (error) {
        console.log(error);
        return new Response('Something went wrong', {status: 500})
    }
}