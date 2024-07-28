import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export const getSessionUser = async () =>{
    //Get the user that submitted the request
    const session = await getServerSession(authOptions);

    if(!session || !session.user){
        return null;
    }

    return{
        user: session.user,
        userID: session.user.id
    }
}