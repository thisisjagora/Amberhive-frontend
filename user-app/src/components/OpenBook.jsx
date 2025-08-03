import React from "react";
import { ReactReader } from "react-reader";

console.log(
  `https://d32d-105-112-236-80.ngrok-free.app/storage/${bookDetail.book.book}`
);
const OpenBook = () => {
  return (
    <div>
      <div style={{ height: "100vh" }}>
        <ReactReader
          url={`https://d32d-105-112-236-80.ngrok-free.app/storage/${bookDetail.book.book}`}
          locationChanged={(epubcfi) => console.log(epubcfi)}
        />
      </div>
    </div>
  );
};

export default OpenBook;
