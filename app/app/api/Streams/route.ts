import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { urlRegex } from "@/app/lib/utils";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";


const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string() 
  });

export async function POST(req : NextRequest){
    try {
    const data = CreateStreamSchema.parse(await req.json());
    const isYT = data.url.match(urlRegex);
    if(!isYT){
        return NextResponse.json({
            message : "Error while adding a stream"
        },
        {
            status : 411
        })
    }
    const extractedId = data.url.split("?v=")[1];
    const res = await youtubesearchapi.GetVideoDetails(extractedId);
    const thumbnails = res.thumbnail.thumbnails;
    thumbnails.sort((a:{width:number},b:{width:number})=>a.width<b.width?-1:1);
    const stream= await prismaClient.stream.create({
        data:
        { 
            userId : data.creatorId,
            url: data.url,
            title : res.title ?? "Can't find the video",
            extractedId,
            smallImage : (thumbnails.length > 1 ? thumbnails[thumbnails.length-2].url : thumbnails[thumbnails.length-1].url) ?? "https://a.storyblok.com/f/151320/437e0f3801/dieren-zooparc-capybara.jpg",
            bigImage :(thumbnails[thumbnails.length-1].url) ?? "https://a.storyblok.com/f/151320/437e0f3801/dieren-zooparc-capybara.jpg",
            type : "Youtube",
           


        }

    });
    return NextResponse.json({
       ...stream,
       hasUpvoted : false,
       upvotes : 0
    })
}
    catch(e){
        console.log(e);
        return NextResponse.json({
            message : "Error while adding a stream"
        },
        {
            status : 411
        })
    }

}

export async function GET(req: NextRequest){
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    console.log('authOptions '+authOptions)
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json(
            { message: "Unauthenticated" },
            { status: 403 }
        );
    }
    const user = await prismaClient.user.findFirst({
        where:{
            email : session?.user?.email ?? ""
        }
    });
    if(!user){
        return NextResponse.json({
            message : "Unauthenticated"
        },{
            status : 403
        })
    }
    if (!creatorId){
        return NextResponse.json({
            message : "Error"
        },{
            status : 411
        })
    }
    const [streams, activeStream] = await Promise.all([await prismaClient.stream.findMany({
        where:{
            userId: creatorId,
            played : false
        },
        include:{
            _count:{
                select:{
                    upvotes:true
                }
            },
            upvotes:{
                where:{
                    userId: user?.id
                }
            }
        }
    }), prismaClient.currentStream.findFirst({
        where:{
            userId: creatorId
        }, 
        include:{
            currentStream : true
        }
    })])
    return NextResponse.json({
        streams: streams.map(({_count, ...rest})=>({
            ...rest,
            upvotesCount : _count.upvotes,
            haveUpvoted : rest.upvotes.length ? true : false

        })),
        activeStream
    });
    
}

