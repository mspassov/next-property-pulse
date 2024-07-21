import connectDB from "@/config/db";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = 'force-dynamic';

//PUT - /api/messages/:id - Mark message as Read
export const PUT = async (request, {params}) =>{
    try {
        await connectDB();

        const {id} = params;

        const sessionUser = await getSessionUser();
        if(!sessionUser || !sessionUser.user){
            return new Response ('User ID is required. Cannot submit message', {status: 401});
        }

        const {userID} = sessionUser;

        const message = await Message.findById(id);

        if(!message){
            return new Response('Message not found', {status: 404});
        }

        message.read = !message.read;
        await message.save();

        return new Response(JSON.stringify(message), {status: 200});

    } catch (error) {
        console.log(error);
        return new Response('Something went wrong', {status:500});
    }
}

//DELETE - /api/messages/:id - Delete message
export const DELETE = async (request, {params}) =>{
    try {
        await connectDB();

        const {id} = params;

        const sessionUser = await getSessionUser();
        if(!sessionUser || !sessionUser.user){
            return new Response ('User ID is required. Cannot submit message', {status: 401});
        }

        const {userID} = sessionUser;

        const message = await Message.findById(id);

        if(!message){
            return new Response('Message not found', {status: 404});
        }

        await message.deleteOne();

        return new Response('Message deleted', {status: 200});

    } catch (error) {
        console.log(error);
        return new Response('Something went wrong', {status:500});
    }
}