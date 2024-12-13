import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getSession } from "next-auth/react";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log("session = ", session);
  if (!session) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
  }
  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });
  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthenticated",
      },
      {
        status: 403,
      }
    );
  }
  const streams = await prismaClient.stream.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      _count: {
        select: {
          upvotes: true,
        },
      },
      upvotes: {
        where: {
          userId: user?.id,
        },
      },
    },
  });
  return NextResponse.json({
    streams: streams.map(({ _count, ...rest }) => ({
      ...rest,
      upvotesCount: _count.upvotes,
      haveUpvoted: rest.upvotes.length ? true : false,
    })),
  });
}
