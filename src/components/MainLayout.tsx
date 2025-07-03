import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
