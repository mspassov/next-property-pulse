import connectDB from "@/config/db";
import Property from '@/models/Property'
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";


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

//DELETE api/properties/:id - delete the listing with the given ID
export const DELETE = async (request, {params}) =>{
    try {
         const sessionUser = await getSessionUser();
         console.log(sessionUser);
         if(!sessionUser){
            return new Response('No valid user', {status: 401});
         }

         const {userID} = sessionUser;

        await connectDB();

        const property = await Property.findById(params.id);

        if(!property){
            return new Response('No property with this ID found', {status: 404});
        }

        //Verify that the property belongs to the user
        if(property.owner.toString() !== userID){
            return new Response('Not the ownder of this property', {status: 401})
        }

        // extract public id's from image url in DB
        const publicIds = property.images.map((imageUrl) => {
            const parts = imageUrl.split('/');
            return parts.at(-1).split('.').at(0);
        });

        // Delete images from Cloudinary
        if (publicIds.length > 0) {
            for (let publicId of publicIds) {
                await cloudinary.uploader.destroy('PropertyPulse/' + publicId);
            }
        }

        //Delete the property
        await property.deleteOne();

        return new Response('Property successfully deleted', {status: 200})
    } catch (error) {
        console.log(error);
        return new Response('Something went wrong', {status: 500})
    }
}