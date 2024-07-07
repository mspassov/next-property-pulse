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

//PUT /api/properties/:id - updated an edited property, given an ID
export const PUT = async (request, {params}) =>{
    try {
        await connectDB();
        const sessionUser = await getSessionUser();

        const { id } = params;
        
        const {userID} = sessionUser;
        console.log(userID);

        //Get the form data, using built in methods
        const formData = await request.formData();

        //Get the amenities
        const amenities = formData.getAll('amenities');

        //Get current property
        const currProperty = await Property.findById(id);

        if(!currProperty){
            return new Response('Property does not exist', {status: 404});
        }

        //Verify ownership
        if(userID !== currProperty.owner.toString()){
            return new Response('Cannot access property', {status: 401})
        }

        //Create property object
        const propertyData = {
            type: formData.get('type'),
            name: formData.get('name'),
            description: formData.get('description'),
            location: {
                street: formData.get('location.street'),
                city: formData.get('location.city'),
                state: formData.get('location.state'),
                zipcode: formData.get('location.zipcode'),
            },
            beds: formData.get('beds'),
            baths: formData.get('baths'),
            square_feet: formData.get('square_feet'),
            amenities,
            rates: {
                weekly: formData.get('rates.weekly'),
                monthly: formData.get('rates.monthly'),
                nightly: formData.get('rates.nightly.'),
            },
            seller_info: {
                name: formData.get('seller_info.name'),
                email: formData.get('seller_info.email'),
                phone: formData.get('seller_info.phone'),
            },
            owner: userID,
        };

        //Update the property in MongoDB
        const updProperty = await Property.findByIdAndUpdate(id, propertyData);

        return new Response(JSON.stringify(updProperty), {status: 200});
        
    } catch (error) {
        return new Response('Failed to update property', {status: 500})   
    }
}