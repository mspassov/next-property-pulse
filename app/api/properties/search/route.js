import connectDB from "@/config/db";
import Property from "@/models/Property";

//GET /api/properties/search
export const GET = async (request) => {
    try {
        await connectDB();

        const {searchParams} = new URL(request.url);
        const search = searchParams.get('search');
        const propertyType = searchParams.get('propertyType');

        const searchPattern = new RegExp(search, 'i');
        let query = {
            $or: [
                {name: searchPattern},
                {description: searchPattern},
                {'location.street': searchPattern},
                {'location.city': searchPattern},
                {'location.state': searchPattern},
                {'location.zipcode': searchPattern},
            ]
        } 

        //Check for property type, if it is not "All"
        if(propertyType !== 'All'){
            const typePattern = new RegExp(propertyType, 'i');
            query.type = typePattern;
        }

        const properties = await Property.find(query);

        return new Response(JSON.stringify(properties), {status: 200})

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({message: 'Failure'}), {status: 500})
    }
}