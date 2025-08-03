import Sidebar from "./Sidebar";

const Layout = ({ header, children }) => {
  return (
    <div className="flex h-screen font-gilroy">
      <Sidebar />
      <div className="flex-1 overflow-hidden  flex flex-col mt-24 md:mt-0 relative">
        {/* Page-specific header */}
        <header className="fixed top-0 left-0 md:left-72  right-0 bg-white z-10 md:h-16 px-4 flex items-center">
          {header}
        </header>

        {/* Content */}
        <main className="flex flex-col  w-full pt-20 px-2 overflow-auto md:flex-1 ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
