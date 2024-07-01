import GoogleProvider from "next-auth/providers/google"
import connectDB from "@/config/db"
import User from "@/models/User"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    // ...add more providers here
  ],
  callbacks:{
    // On successful Login
    async signIn({profile}){
        await connectDB();

        const existingUser = await User.findOne({email: profile.email});

        if(!existingUser){
          const username = profile.name.slice(0, 20) //truncating, only because it might be long and may cause problems with MngoDB
          await User.create({
            email: profile.email,
            username: username,
            image: profile.picture
          })
        }

        return true; 
    },

    //Modify the session object
    async session({session}){
        const user = await User.findOne({email: session.user.email});
        session.user.id = user._id.toString();
        return session;
    }
  }
}