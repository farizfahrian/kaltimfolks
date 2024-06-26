import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

//GET POST
export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page")) || 1; // Parse page to integer, default to 1
  const cat = searchParams.get("cat");

  const POST_PER_PAGE = 5;


  // EDITAN SUDAR

  //   const query = {
  //     take: POST_PER_PAGE,
  //     skip: POST_PER_PAGE * (page - 1),
  //     where: {
  //       ...(cat && { catSlug: cat }),
  //     },
  //     orderBy: {
  //       createdAt: "desc", // Sort by createdAt field in descending order
  //     },
  //   };

  //   try {
  //     const [posts, count] = await prisma.$transaction([
  //       // prisma.post.findMany(query),
  //       prisma.post.findMany({
  //         take: 5,
  //         orderBy: {
  //           views: "desc",
  //         },
  //       }),
  //       prisma.post.count({ where: query.where }),
  //     ]);
  //     return new NextResponse(JSON.stringify({ posts, count }, { status: 200 }));
  //   } catch (err) {
  //     console.log(err);
  //     return new NextResponse(
  //       JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
  //     );
  //   }
  // };

  const query = {
    take: POST_PER_PAGE,
    skip: POST_PER_PAGE * (page - 1),
    where: {
      ...(cat && { catSlug: cat }),
    },
    orderBy: {
      createdAt: "desc" // Sort by createdAt field in descending order
    }
  };

  try {
    const [posts, count] = await prisma.$transaction([
      prisma.post.findMany(query),
      prisma.post.count({ where: query.where }),
    ]);
    return new NextResponse(JSON.stringify({ posts, count }, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

// CREATE A POST
export const POST = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
    );
  }

  try {
    const body = await req.json();
    const post = await prisma.post.create({
      data: { ...body, userEmail: session.user.email },
    });

    return new NextResponse(JSON.stringify(post, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

// DELETE A POST
export const DELETE = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
    );
  }

  try {
    const postId = req.query.postId; // Assuming postId is passed as a query parameter
    const post = await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return new NextResponse(JSON.stringify(post, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};
