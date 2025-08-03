// components/headers/AllBookHeader.jsx
const AllBookHeader = ({ count = 0 }) => (
  <div className="flex flex-col px-2 mt-20 md:mt-0 justify-start items-start w-full">
    <div className="flex items-center gap-4">
      <h2 className="text-xl font-semibold text-gray-800">All Books</h2>
      <span className="text-base text-yellow-600 font-semibold">
        {count} book(s)
      </span>
    </div>
    <p className="text-gray-500 text-sm">
      Track and manage all your ebooks from this dashboard.
    </p>
  </div>
);

export default AllBookHeader;
