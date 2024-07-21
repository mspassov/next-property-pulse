import connectDB from "@/config/db";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = 'force-dynamic';

//GET - /api/messages
export const GET = async () =>{
    try {
        await connectDB();

        const sessionUser = await getSessionUser();
        if(!sessionUser || !sessionUser.user){
            return new Response ('User ID is required. Cannot submit message', {status: 401});
        }

        const {userID} = sessionUser;

        const messages = await Message.find({recipient: userID})
            .populate('sender', 'username').populate('property', 'name')
            .sort({read: 'asc', createdAt: 'desc'});

        return new Response(JSON.stringify(messages), {status: 200});

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({message: 'Something went wrong'}), {status: 500});
    }
}

// POST - /api/messages
export const POST = async (request) =>{
    try {
        await connectDB();

        const {name, email, phone, message, property, recipient} = await request.json();

        const sessionUser = await getSessionUser();
        if(!sessionUser || !sessionUser.user){
            return new Response ('User ID is required. Cannot submit message', {status: 401});
        }

        const {user} = sessionUser;

        const newMessage = new Message({
            sender: user.id,
            recipient,
            property,
            email,
            phone,
            body: message,
            name
        })

        await newMessage.save();

        return new Response(JSON.stringify({message: 'Message sent successfully'}), {status: 200});

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({message: 'Something went wrong'}), {status: 500});
    }
}