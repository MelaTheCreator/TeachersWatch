import { NextResponse } from "next/server";
import { createNews, getNews } from "@/lib/news";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const news = await getNews();
    return NextResponse.json(news);
  } catch (err) {
    console.error("GET NEWS ERROR:", err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session.user?.email === "mela@gmx.de";

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const { title, text, image } = body;

    const news = await createNews({
      title,
      text,
      image,
      author: session.user?.name,
    });

    return NextResponse.json(news);
  } catch (err) {
    console.error("POST NEWS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
