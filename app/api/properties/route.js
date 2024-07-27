import connectDB from "@/config/db";
import Property from '@/models/Property'
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";


//GET api/properties - fetches all of the properties in the database
export const GET = async (request) =>{
    try {
        await connectDB();

        //Create the pagination
        const {searchParams} = new URL(request.url);
        const page = searchParams.get('page') || 1;
        const pageSize = searchParams.get('pageSize') || 3;

        const skip = (page - 1) * pageSize;

        const totalProperties = await Property.countDocuments({});
        const propertiesData = await Property.find({}).skip(skip).limit(pageSize);

        const result = {
            totalProperties,
            properties: propertiesData
        }

        return new Response(JSON.stringify(result), {status: 200})
    } catch (error) {
        console.log(error);
        return new Response('Something went wrong', {status: 500})
    }
}

//POST /api/properties - adds a property to the database
export const POST = async (request) =>{
    try {
        await connectDB();

        
        const {userID} = await getSessionUser();

        //Get the form data, using built in methods
        const formData = await request.formData();

        //Get the amenities
        const amenities = formData.getAll('amenities');

        //Get the images
        const images = formData.getAll('images');

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

        //Upload images to Cloudinary
        const imageUrls = [];

        for(const image of images){
            const imageBuffer = await image.arrayBuffer();
            const imageArray = Array.from(new Uint8Array(imageBuffer));
            const imageData = Buffer.from(imageArray);

            //Convert the image data to base64
            const imageBase64 = imageData.toString('base64');

            //Upload to cloudinary
            const result = await cloudinary.uploader.upload(`data:image/png;base64,${imageBase64}`,{folder: 'PropertyPulse'});
            
            imageUrls.push(result.secure_url);
        }

        //Wait for all images to be uploaded
        const uploadedImages = await Promise.all(imageUrls);
        propertyData.images = uploadedImages;

        const newProperty = new Property(propertyData);
        await newProperty.save();

        return Response.redirect(`${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`);
    } catch (error) {
        return new Response('Failed to add property', {status: 500})   
    }
}