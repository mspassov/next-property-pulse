import connectDB from "@/config/db";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";


//WARNING: you must do this, otherwise it breaks in Prod
export const dynamic = 'force-dynamic';

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
        
        return new Response(JSON.stringify({isBookmarked}), {status: 200});

    } catch (error) {
        return new Response('Something went wrong', {status: 500});
    }
}