import Footer from "./Footer";
import Navbar from "./Navbar";
import { Outlet } from "react-router";

export default function DefaultLayout() {
  return (
    <div className="flex flex-col min-h-screen font-gilroy">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
