import connectDB from "@/config/db";
import User from "@/models/User";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";


//WARNING: you must do this, otherwise it breaks in Prod
export const dynamic = 'force-dynamic';

//GET - Fetch saved properties given a user
export const GET = async () =>{
    try {
        await connectDB();

        const sessionUser = await getSessionUser();

        if(!sessionUser || !sessionUser.userID){
            return new Response('User ID required', {status: 401});
        }

        const {userID} = sessionUser;
        
        //Get user from the database
        const user = await User.findOne({_id: userID});

        //Get bookmarks for user
        const bookmarks = await Property.find({_id: {$in: user.bookmarks}});

        return new Response(JSON.stringify(bookmarks), {status: 200});
    } catch (error) {
        console.log(error);
        return new Response('Could not get bookmarks', {status: 500});
    }
}

//POST - Save property as bookmark in user profile
export const POST = async (request) =>{
    try {
        await connectDB();

        const {propertyId} = await request.json();
        const sessionUser = await getSessionUser();

        if(!sessionUser || !sessionUser.userID){
            return new Response('User ID required', {status: 401});
        }

        const {userID} = sessionUser;

        //Get user from the database
        const user = await User.findOne({_id: userID});

        //Check to make sure that property isn't already bookmarked
        let isBookmarked = user.bookmarks.includes(propertyId);
        let message;

        if(isBookmarked){
            //If already bookmarked, remove the bookmark
            user.bookmarks.pull(propertyId);
            message = "Bookmark removed successfully";
            isBookmarked = false;
        } else{
            user.bookmarks.push(propertyId);
            message = "Bookmark added successfully";
            isBookmarked = true;
        }

        //Save to database
        await user.save();
        
        return new Response(JSON.stringify({message, isBookmarked}), {status: 200});

    } catch (error) {
        return new Response('Something went wrong', {status: 500});
    }
}