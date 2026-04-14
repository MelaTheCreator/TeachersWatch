import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <Header />

        {/* CONTENT */}
        <main className="p-6 flex justify-center ">{children}</main>
      </div>
    </div>
  );
}
