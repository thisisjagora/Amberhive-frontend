// components/headers/DrafttHeader.jsx
const DrafttHeader = () => (
  <div className="flex flex-col mt-20 px-4 md:mt-0 gap-8 md:gap-0 justify-start items-start w-full">
    <h2 className="text-xl font-semibold text-gray-800">Draft</h2>
    <p className="text-sm text-gray-500">
      These are your saved drafts. You can continue editing them when
      you're ready.
    </p>
  </div>
);

export default DrafttHeader;
