import { useState } from "react";
import { ReactReader } from "react-reader";

const ReaderEpub = ({ url }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const handleRendition = (rendition) => {
    rendition.spread("none");

    // Apply custom styles
    rendition.themes.default({
      body: {
        background: "#fff",
        color: "#000",
        fontFamily: "Gilroy, sans-serif",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
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

    // Block copy, context menu, text selection, drag
    rendition.hooks.content.register((contents) => {
      const doc = contents.document;

      // Disable right-click context menu
      doc.addEventListener("contextmenu", (e) => e.preventDefault());

      // Disable text copying
      doc.addEventListener("copy", (e) => e.preventDefault());

      // Disable selection
      doc.addEventListener("selectstart", (e) => e.preventDefault());

      // Disable text drag
      doc.addEventListener("dragstart", (e) => e.preventDefault());
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
