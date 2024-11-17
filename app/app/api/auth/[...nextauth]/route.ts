
import { prismaClient } from "@/app/lib/db";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextResponse } from "next/server";



export const authOptions: NextAuthOptions = NextAuth({
  providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      }),
    ],
    secret : process.env.NEXTAUTH_SECRET ?? "secret",
     callbacks: {
      async signIn(params) {
       
          if(!params.user.email){
            return false;
          }
         
          
          try{
            await prismaClient.user.create({
              data:{
                email : params.user.email,
                provider : "Google"
              }
            })
          }catch(e){
            console.error("Error saving user to database:", e);
          
          }
          return true;
      },
      

    async redirect({ url, baseUrl}) {
      // Always redirect to /dashboard after login
      // You can add other conditions if needed for different scenarios
      return baseUrl + "/dashboard"; 
    },

    }
  });



export { authOptions as GET, authOptions as POST }

