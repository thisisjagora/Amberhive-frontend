import { useState } from "react";
import { ReactReader } from "react-reader";

const ReaderEpub = ({ url }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const handleRendition = (rendition) => {
    rendition.spread("none");
    rendition.themes.default({
      body: {
        background: "#fff",
        color: "#000",
        fontFamily: "Gilroy, sans-serif",
      },
      a: {
        color: "#000",
        textDecoration: "none",
      },
      "a:hover": {
        color: "#000",
        textDecoration: "underline",
      },
    });
  };

  const handleError = (err) => {
    console.error("EPUB error:", err);
    setError("Failed to load EPUB file.");
  };

  return (
    <div className="w-full h-full overflow-hidden">
      {error ? (
        <div className="h-full flex items-center justify-center text-red-500">
          {error}
        </div>
      ) : url ? (
        <ReactReader
          url={url}
          location={location}
          locationChanged={setLocation}
          getRendition={handleRendition}
          epubInitOptions={{ openAs: "epub", restore: true }}
          onError={handleError}
          //   showToc={false}
        />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          No EPUB file found.
        </div>
      )}
    </div>
  );
};

export default ReaderEpub;
