import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import NewsSection from "@/components/NewsSection";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return <NewsSection session={session} />;
}
