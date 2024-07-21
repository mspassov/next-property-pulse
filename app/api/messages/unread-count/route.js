import connectDB from "@/config/db";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = 'force-dynamic';

//GET - /api/messages/unread-count
export const GET = async (request) =>{
    try {
        await connectDB();

        const sessionUser = await getSessionUser();
        if(!sessionUser || !sessionUser.user){
            return new Response ('User ID is required. Cannot submit message', {status: 401});
        }

        const {userID} = sessionUser;

        const unreadCount = await Message.countDocuments({recipient: userID, read: false});


        return new Response(JSON.stringify({count: unreadCount}), {status: 200});

    } catch (error) {
        console.log(error);
        return new Response('Something went wrong', {status:500});
    }
}