export default function Mission() {
  return (
    <section className="relative py-12 bg-white">
      <div className=" flex flex-col md:flex-row items-start md:items-center gap-10">
        {/* Left Column - Heading */}
        <div className="relative w-full md:w-1/2">
          {/* Watermark */}
          <h2 className="text-5xl md:text-7xl font-extrabold text-gray-100 absolute -top-2 md:-top-6 -left-2 select-none ">
            AmberHive
          </h2>

          {/* Title */}
          <h2 className="relative text-2xl px-4 font-semibold z-10">
            Our <span className="text-yellow-500">Mission</span>
          </h2>
        </div>

        {/* Right Column - Text */}
        <div className="w-full md:w-1/2 text-gray-700 py-6 p-4 md:py-4 text-center md:text-left text-sm leading-relaxed">
          AmberHive is committed to amplifying African voices, bridging the gap between writers and readers, and ensuring
          that the continent’s literary wealth is accessible to a global audience. We aim to provide African authors with the
          tools, knowledge, and opportunities to thrive in the publishing industry while fostering a vibrant community of
          engaged readers.
        </div>
      </div>

      {/* Bottom Border */}
      <hr className="mt-8 border-gray-300" />
    </section>
  );
}
