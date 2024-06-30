import connectDB from "@/config/db";
import Property from '@/models/Property'


//GET api/properties/:id - fetch 1 property from the database, based on the ID
export const GET = async (request, {params}) =>{
    try {
        await connectDB();

        const property = await Property.findById(params.id);

        if(!property){
            return new Response('No property with this ID found', {status: 404});
        }

        return new Response(JSON.stringify(property), {status: 200})
    } catch (error) {
        console.log(error);
        return new Response('Something went wrong', {status: 500})
    }
}