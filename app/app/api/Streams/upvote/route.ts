import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]/route";

const upvoteSchema = z.object({
    streamId : z.string()
})
export async function POST(req: NextRequest){
    const session = await getServerSession(authOptions);
    const user = await prismaClient.user.findFirst({
        where:{
            email : session?.user?.email ??""
        }
    });
    if(!user){
        return NextResponse.json({
            message : "Unauthenticated"
        },{
            status : 403
        })
    }

    try{
        const data = upvoteSchema.parse(await req.json());
        await prismaClient.upvote.create({
            data:{
                
                   userId:user.id,
                   streamId : data.streamId
                
            }    

        })
        return NextResponse.json({
            message : "done :)"
        
        })
    }

    catch(e){
        return NextResponse.json({
            message: "Error while downvoting"

        },{
            status : 403

        })
    }
}

